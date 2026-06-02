/**
 * Gera em lote:
 * - 1 post ranking (todos os produtos comparados)
 * - 1 post individual por produto
 *
 * Salva automaticamente como DRAFT no banco.
 * Retorna streaming de progresso via Server-Sent Events.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gerarPostRanking, gerarPostIndividual, AIConfig, AIProvider, ProdutoParaPost } from "@/lib/ai";
import { slugify } from "@/lib/utils";

interface LinkBacklink {
  palavra: string;
  url: string;
  tipo: "interno" | "externo";
  novaAba?: boolean;
}

interface BodyRequest {
  titulo: string;
  palavraPrimaria: string;
  categoria: string;
  tipo: "REVIEW" | "GUIA";
  produtos: ProdutoParaPost[];
  backlinks?: LinkBacklink[];
  status?: string; // DRAFT | PUBLISHED
}

export async function POST(req: NextRequest) {
  // Headers explícitos para garantir que a resposta seja sempre JSON, nunca HTML
  const jsonHeaders = { "Content-Type": "application/json" };

  try {
    let body: BodyRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Corpo da requisição inválido (JSON malformado)" }, { status: 400, headers: jsonHeaders });
    }

    const { titulo, palavraPrimaria, categoria, tipo, produtos, backlinks, status } = body;

    if (!titulo || !palavraPrimaria || !categoria || !produtos?.length) {
      return NextResponse.json(
        { error: "Campos obrigatórios: titulo, palavraPrimaria, categoria, produtos" },
        { status: 400, headers: jsonHeaders }
      );
    }

    // Busca config de IA ativa
    let aiConfig;
    try {
      aiConfig = await prisma.aISettings.findFirst({ where: { ativo: true } });
    } catch (dbErr) {
      return NextResponse.json(
        { error: `Erro no banco de dados: ${(dbErr as Error).message}. Verifique se as migrações foram aplicadas.` },
        { status: 500, headers: jsonHeaders }
      );
    }
    if (!aiConfig?.apiKey) {
      return NextResponse.json(
        { error: "Nenhum provedor de IA configurado. Acesse Admin → Configurações → IA." },
        { status: 422, headers: jsonHeaders }
      );
    }

    const config: AIConfig = {
      provider: aiConfig.provider as AIProvider,
      apiKey: aiConfig.apiKey,
      model: aiConfig.model || "",
      promptRanking: aiConfig.promptRanking,
      promptIndividual: aiConfig.promptIndividual,
    };

    const linksJson = backlinks?.length ? JSON.stringify(backlinks) : null;
    const postStatus = status || "DRAFT";
    const postPublishedAt = postStatus === "PUBLISHED" ? new Date() : null;

    const resultados: Array<{
      tipo: "ranking" | "individual";
      produtoNome?: string;
      postId: string;
      slug: string;
      titulo: string;
      erro?: string;
    }> = [];

    // ---- 1. Gerar post RANKING ----
    let rankingResult;
    try {
      rankingResult = await gerarPostRanking(config, {
        titulo,
        palavraPrimaria,
        categoria,
        tipo,
        produtos,
        modoGeracao: "ranking",
        linkBacklinks: backlinks,
      });
    } catch (e) {
      return NextResponse.json({ error: `Erro ao gerar ranking: ${(e as Error).message}` }, { status: 500 });
    }

    const rankingSlug = (rankingResult.slug as string) || slugify(titulo);
    const rankingConteudo = { ...rankingResult };
    delete rankingConteudo.metaTitle;
    delete rankingConteudo.metaDescription;
    delete rankingConteudo.resumo;
    delete rankingConteudo.slug;

    const rankingPost = await prisma.post.create({
      data: {
        titulo,
        slug: await uniqueSlug(rankingSlug),
        palavraPrimaria,
        categoria,
        tipo,
        metaTitle: (rankingResult.metaTitle as string) || titulo,
        metaDescription: (rankingResult.metaDescription as string) || "",
        resumo: (rankingResult.resumo as string) || "",
        conteudoJson: JSON.stringify(rankingConteudo),
        status: postStatus,
        publishedAt: postPublishedAt,
        linksJson,
      },
    });

    // Adiciona PostProducts automaticamente
    if (Array.isArray(rankingResult.ranking)) {
      for (const item of rankingResult.ranking as Array<Record<string, unknown>>) {
        const produtoUrl = item.urlOriginal as string;
        const produtoDados = produtos.find((p) => p.urlOriginal === produtoUrl) || produtos[Number(item.posicao) - 1];
        if (!produtoDados) continue;

        let product = await prisma.product.findFirst({ where: { nome: produtoDados.nome } });
        if (!product) {
          const pSlug = await uniqueSlugProduct(slugify(produtoDados.nome));
          product = await prisma.product.create({
            data: {
              slug: pSlug,
              nome: produtoDados.nome,
              descricaoCurta: (produtoDados.descricaoCompleta || "").slice(0, 300),
              categoria,
              imagemUrl: produtoDados.imagemUrl || null,
              precoReferencial: produtoDados.preco ? parseFloat(produtoDados.preco.replace(/[^\d,.]/g, "").replace(",", ".")) || null : null,
              ...(produtoDados.plataforma === "Mercado Livre" ? { urlMercadoLivre: produtoDados.urlOriginal } : {}),
              ...(produtoDados.plataforma === "Amazon" ? { urlAmazon: produtoDados.urlOriginal } : {}),
              ...(produtoDados.plataforma === "Shopee" ? { urlShopee: produtoDados.urlOriginal } : {}),
            },
          });
        }

        const posicao = Number(item.posicao) || 1;
        const existingPP = await prisma.postProduct.findFirst({ where: { postId: rankingPost.id, posicao } });
        if (!existingPP) {
          await prisma.postProduct.create({
            data: {
              postId: rankingPost.id,
              productId: product.id,
              posicao,
              rotuloDestaque: (item.rotuloDestaque as string) || null,
              resumoCurto: (item.resumoCurto as string) || null,
              pros: Array.isArray(item.pros) ? (item.pros as string[]).join("\n") : null,
              contras: Array.isArray(item.contras) ? (item.contras as string[]).join("\n") : null,
              indicadoPara: (item.indicadoPara as string) || null,
            },
          });
        }
      }
    }

    resultados.push({
      tipo: "ranking",
      postId: rankingPost.id,
      slug: rankingPost.slug,
      titulo: rankingPost.titulo,
    });

    // ---- 2. Gerar 1 post INDIVIDUAL por produto ----
    for (let i = 0; i < produtos.length; i++) {
      const produto = produtos[i];
      const tituloIndividual = `Review: ${produto.nome} — Vale a Pena em ${new Date().getFullYear()}?`;
      const ppPrimaria = produto.nome.split(" ").slice(0, 5).join(" ").toLowerCase();

      try {
        const individualResult = await gerarPostIndividual(config, {
          titulo: tituloIndividual,
          palavraPrimaria: ppPrimaria,
          categoria,
          tipo: "REVIEW",
          produto,
          linkBacklinks: backlinks,
        });

        const indSlug = (individualResult.slug as string) || slugify(tituloIndividual);
        const indConteudo = { ...individualResult };
        delete indConteudo.metaTitle;
        delete indConteudo.metaDescription;
        delete indConteudo.resumo;
        delete indConteudo.slug;

        // Cria ou encontra o produto no banco
        let product = await prisma.product.findFirst({ where: { nome: produto.nome } });
        if (!product) {
          const pSlug = await uniqueSlugProduct(slugify(produto.nome));
          product = await prisma.product.create({
            data: {
              slug: pSlug,
              nome: produto.nome,
              descricaoCurta: (produto.descricaoCompleta || "").slice(0, 300),
              categoria,
              imagemUrl: produto.imagemUrl || null,
              precoReferencial: produto.preco ? parseFloat(produto.preco.replace(/[^\d,.]/g, "").replace(",", ".")) || null : null,
              ...(produto.plataforma === "Mercado Livre" ? { urlMercadoLivre: produto.urlOriginal } : {}),
              ...(produto.plataforma === "Amazon" ? { urlAmazon: produto.urlOriginal } : {}),
              ...(produto.plataforma === "Shopee" ? { urlShopee: produto.urlOriginal } : {}),
            },
          });
        }

        const indPost = await prisma.post.create({
          data: {
            titulo: tituloIndividual,
            slug: await uniqueSlug(indSlug),
            palavraPrimaria: ppPrimaria,
            categoria,
            tipo: "REVIEW",
            metaTitle: (individualResult.metaTitle as string) || tituloIndividual,
            metaDescription: (individualResult.metaDescription as string) || "",
            resumo: (individualResult.resumo as string) || "",
            conteudoJson: JSON.stringify(indConteudo),
            status: postStatus,
            publishedAt: postPublishedAt,
            linksJson,
            parentPostId: rankingPost.id,
          },
        });

        // Associa o produto ao post individual
        await prisma.postProduct.create({
          data: {
            postId: indPost.id,
            productId: product.id,
            posicao: 1,
            rotuloDestaque: null,
            resumoCurto: (produto.descricaoCompleta || "").slice(0, 300) || null,
          },
        });

        resultados.push({
          tipo: "individual",
          produtoNome: produto.nome,
          postId: indPost.id,
          slug: indPost.slug,
          titulo: indPost.titulo,
        });
      } catch (e) {
        resultados.push({
          tipo: "individual",
          produtoNome: produto.nome,
          postId: "",
          slug: "",
          titulo: tituloIndividual,
          erro: (e as Error).message,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      totalGerados: resultados.filter((r) => !r.erro).length,
      totalErros: resultados.filter((r) => r.erro).length,
      posts: resultados,
    });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message ?? "Erro interno desconhecido" },
      { status: 500, headers: jsonHeaders }
    );
  }
}

// Helpers para slug único
async function uniqueSlug(base: string, n = 0): Promise<string> {
  const candidate = n === 0 ? base : `${base}-${n}`;
  const existing = await prisma.post.findUnique({ where: { slug: candidate } });
  if (!existing) return candidate;
  return uniqueSlug(base, n + 1);
}

async function uniqueSlugProduct(base: string, n = 0): Promise<string> {
  const candidate = n === 0 ? base : `${base}-${n}`;
  const existing = await prisma.product.findUnique({ where: { slug: candidate } });
  if (!existing) return candidate;
  return uniqueSlugProduct(base, n + 1);
}
