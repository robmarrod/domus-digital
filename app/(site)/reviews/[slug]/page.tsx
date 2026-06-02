export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ReviewCard } from "@/components/review-card";
import { ProductAffiliateButtons } from "@/components/product-affiliate-buttons";
import { AuthorBox } from "@/components/author-box";
import { RankingSidebar } from "@/components/ranking-sidebar";
import type { SidebarItem } from "@/components/ranking-sidebar";
import { prisma } from "@/lib/prisma";
import { parseJsonSafe, formatDate, parseLines } from "@/lib/utils";
import type { ConteudoJson } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, XCircle, Users } from "lucide-react";

interface PageProps {
  params: { slug: string };
}

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      postProducts: {
        orderBy: { posicao: "asc" },
        include: { product: true },
      },
    },
  });
}

async function getAffiliateSettings() {
  return (
    (await prisma.affiliateSettings.findFirst()) ?? {
      amazonTag: null,
      shopeeParam: null,
      mercadoLivreParam: null,
    }
  );
}

async function getRelatedPosts(categoria: string, excludeSlug: string) {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      categoria,
      slug: { not: excludeSlug },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, slug: true, titulo: true, resumo: true,
      categoria: true, tipo: true, publishedAt: true, imagemUrl: true,
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle ?? undefined,
      description: post.metaDescription ?? undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

// Monta os itens da sidebar com base no conteúdo e produtos
function buildSidebarItems(
  conteudo: ConteudoJson,
  postProducts: { posicao: number; product: { nome: string } }[]
): SidebarItem[] {
  const items: SidebarItem[] = [];

  if (postProducts.length > 0) {
    items.push({ id: "ranking", label: "Ranking" });
  }
  if (conteudo.criterios?.length) {
    items.push({ id: "criterios", label: "Critérios", indent: true });
  }

  postProducts.forEach((pp) => {
    items.push({
      id: `produto-${pp.posicao}`,
      label: pp.product.nome,
      posicao: pp.posicao,
      indent: true,
    });
  });

  if (conteudo.secoes_complementares?.length) {
    conteudo.secoes_complementares.forEach((secao, i) => {
      items.push({ id: `secao-${i}`, label: secao.titulo_h2 });
    });
  }
  if (conteudo.faq?.length) {
    items.push({ id: "faq", label: "Perguntas Frequentes" });
  }
  if (conteudo.conclusao) {
    items.push({ id: "conclusao", label: "Conclusão" });
  }

  return items;
}

// Primeira URL de compra disponível (para botão rápido na tabela)
function firstBuyUrl(product: {
  urlMercadoLivre: string | null;
  urlShopee: string | null;
  urlAmazon: string | null;
}): { url: string; label: string } | null {
  if (product.urlMercadoLivre) return { url: product.urlMercadoLivre, label: "Ver no Mercado Livre" };
  if (product.urlShopee) return { url: product.urlShopee, label: "Ver na Shopee" };
  if (product.urlAmazon) return { url: product.urlAmazon, label: "Ver na Amazon" };
  return null;
}

export default async function ReviewPage({ params }: PageProps) {
  const [post, settings] = await Promise.all([
    getPost(params.slug),
    getAffiliateSettings(),
  ]);

  if (!post || post.status !== "PUBLISHED") notFound();

  const conteudo = parseJsonSafe<ConteudoJson>(post.conteudoJson, {});
  const related = await getRelatedPosts(post.categoria, post.slug);
  const sidebarItems = buildSidebarItems(conteudo, post.postProducts);
  const hasProducts = post.postProducts.length > 0;

  return (
    <div className="bg-nude-200 min-h-screen">
      <div className="container max-w-6xl py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-cafe-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/categoria/${post.categoria.toLowerCase()}`} className="hover:text-brand-600 transition-colors">
            {post.categoria}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-cafe-800 font-medium line-clamp-1 max-w-[240px]">{post.titulo}</span>
        </nav>

        {/* Layout 2 colunas */}
        <div className="flex gap-8 items-start">

          {/* ── COLUNA PRINCIPAL ── */}
          <main className="flex-1 min-w-0">

            {/* Capa */}
            {post.imagemUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.imagemUrl} alt={post.titulo} className="w-full max-h-[380px] object-cover" />
              </div>
            )}

            {/* Cabeçalho */}
            <header className="mb-6 bg-white rounded-2xl p-6 md:p-8 border border-nude-400 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  {post.tipo === "REVIEW" ? "Review" : "Guia"}
                </span>
                <span className="text-cafe-500 text-xs capitalize">{post.categoria}</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-cafe-800 leading-tight mb-4">
                {post.titulo}
              </h1>
              {post.resumo && (
                <p className="text-cafe-600 leading-relaxed border-l-4 border-brand-300 pl-4 mb-3">
                  {post.resumo}
                </p>
              )}
              {post.publishedAt && (
                <p className="text-sm text-cafe-400">Atualizado em {formatDate(post.publishedAt)}</p>
              )}
            </header>

            {/* ── TABELA RÁPIDA DE RANKING ── */}
            {hasProducts && (
              <section id="ranking" className="mb-8 bg-white rounded-2xl border border-nude-400 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-nude-300 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-bold text-cafe-800">Ranking Completo</h2>
                  <span className="text-xs text-cafe-400">{post.postProducts.length} produtos</span>
                </div>
                <div className="divide-y divide-nude-200">
                  {post.postProducts.map((pp) => {
                    const buyLink = firstBuyUrl(pp.product);
                    return (
                      <div key={pp.id} className="flex items-center gap-3 px-4 py-3 hover:bg-nude-100 transition-colors">
                        {/* Posição */}
                        <span className="w-7 h-7 rounded-full bg-nude-300 text-cafe-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {pp.posicao}
                        </span>

                        {/* Imagem */}
                        {pp.product.imagemUrl ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={pp.product.imagemUrl}
                              alt={pp.product.nome}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-nude-300 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">🏠</span>
                          </div>
                        )}

                        {/* Nome */}
                        <div className="flex-1 min-w-0">
                          <a
                            href={`#produto-${pp.posicao}`}
                            className="text-sm font-medium text-cafe-800 hover:text-brand-600 transition-colors line-clamp-1"
                          >
                            {pp.product.nome}
                          </a>
                          {pp.rotuloDestaque && pp.rotuloDestaque !== "__none__" && (
                            <span className="text-xs text-brand-600 font-semibold">{pp.rotuloDestaque}</span>
                          )}
                        </div>

                        {/* Botões */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {buyLink && (
                            <a
                              href={buyLink.url}
                              target="_blank"
                              rel="nofollow noopener"
                              className="text-xs bg-brand-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-brand-600 transition-colors whitespace-nowrap"
                            >
                              Ver preço
                            </a>
                          )}
                          <a
                            href={`#produto-${pp.posicao}`}
                            className="text-xs text-brand-500 hover:underline whitespace-nowrap hidden sm:block"
                          >
                            Ver detalhes
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Aviso editorial */}
            <div className="flex items-start gap-3 bg-brand-50 border border-brand-200 rounded-xl p-4 mb-8 text-sm">
              <span className="text-brand-500 text-base flex-shrink-0">ℹ️</span>
              <p className="text-brand-700 leading-relaxed">
                <strong className="font-semibold">Transparência editorial:</strong> Nossas análises são independentes e baseadas em pesquisa aprofundada. Este artigo pode conter links de afiliado — se você comprar por eles, podemos receber uma comissão sem custo adicional. Isso nunca influencia nossas recomendações.
              </p>
            </div>

            {/* Introdução */}
            {conteudo.introducao && (
              <section className="mb-8 bg-white rounded-2xl p-6 md:p-8 border border-nude-400 shadow-sm">
                {[conteudo.introducao.paragrafo1, conteudo.introducao.paragrafo2, conteudo.introducao.paragrafo3]
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i} className="text-cafe-700 leading-relaxed mb-4 last:mb-0">{p}</p>
                  ))}
              </section>
            )}

            {/* Critérios */}
            {conteudo.criterios && conteudo.criterios.length > 0 && (
              <section id="criterios" className="mb-10 bg-white rounded-2xl p-6 md:p-8 border border-nude-400 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-cafe-800 mb-6 pb-2 border-b border-nude-300">
                  Critérios de Avaliação
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {conteudo.criterios.map((criterio, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-nude-400 bg-nude-100 hover:border-brand-300 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-cafe-800 mb-1 text-sm">{criterio.titulo}</h3>
                        <p className="text-cafe-500 text-xs leading-relaxed">{criterio.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── SEÇÕES DETALHADAS DE PRODUTO ── */}
            {post.postProducts.map((pp, idx) => {
              const prosList = parseLines(pp.pros || pp.product.prosDefault);
              const contrasList = parseLines(pp.contras || pp.product.contrasDefault);
              const rotuloColors: Record<string, string> = {
                "NOSSA ESCOLHA": "bg-brand-500 text-white",
                "MAIOR DESEMPENHO": "bg-yellow-400 text-yellow-900",
                "CUSTO-BENEFÍCIO": "bg-emerald-500 text-white",
                "MAIS POPULAR": "bg-blue-500 text-white",
                "MELHOR PARA INICIANTES": "bg-purple-500 text-white",
              };
              const rotuloClass = pp.rotuloDestaque && pp.rotuloDestaque !== "__none__"
                ? (rotuloColors[pp.rotuloDestaque] ?? "bg-gray-500 text-white")
                : "";

              return (
                <section
                  key={pp.id}
                  id={`produto-${pp.posicao}`}
                  className={`mb-10 bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${idx === 0 ? "border-brand-300" : "border-nude-400"}`}
                >
                  {/* Rótulo de destaque */}
                  {pp.rotuloDestaque && pp.rotuloDestaque !== "__none__" && (
                    <div className={`${rotuloClass} text-center py-2 text-xs font-bold uppercase tracking-widest`}>
                      {pp.rotuloDestaque}
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                    {/* Header do produto: imagem + nome + botões */}
                    <div className="flex flex-col sm:flex-row gap-5 mb-6">
                      {/* Imagem */}
                      <div className="flex-shrink-0">
                        <div className="relative w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-gray-100 border border-nude-300">
                          {pp.product.imagemUrl ? (
                            <Image
                              src={pp.product.imagemUrl}
                              alt={pp.product.nome}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 176px"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-5xl">🏠</div>
                          )}
                        </div>
                        <div className="flex items-center justify-center mt-2">
                          <span className="text-4xl font-bold text-nude-400">#{pp.posicao}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h2 className="font-serif text-xl md:text-2xl font-bold text-cafe-800 leading-snug mb-1">
                          <Link href={`/produto/${pp.product.slug}`} className="hover:text-brand-600 transition-colors">
                            {pp.product.nome}
                          </Link>
                        </h2>
                        {pp.product.marca && (
                          <p className="text-sm text-cafe-400 mb-3">Marca: <strong>{pp.product.marca}</strong></p>
                        )}
                        {pp.product.precoReferencial && (
                          <p className="text-2xl font-bold text-brand-600 mb-3">
                            R$ {pp.product.precoReferencial.toFixed(2).replace(".", ",")}
                            <span className="text-xs text-cafe-400 font-normal ml-2">(referencial)</span>
                          </p>
                        )}
                        <ProductAffiliateButtons
                          urlShopee={pp.product.urlShopee}
                          urlMercadoLivre={pp.product.urlMercadoLivre}
                          urlAmazon={pp.product.urlAmazon}
                          settings={settings}
                          size="default"
                        />
                      </div>
                    </div>

                    {/* Review text */}
                    {pp.resumoCurto && (
                      <div className="mb-6">
                        <p className="text-cafe-700 leading-relaxed">{pp.resumoCurto}</p>
                      </div>
                    )}

                    {/* Prós e Contras */}
                    {(prosList.length > 0 || contrasList.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {prosList.length > 0 && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4" /> Prós
                            </h4>
                            <ul className="space-y-1.5">
                              {prosList.map((pro, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-sm text-emerald-900">
                                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {contrasList.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-1.5">
                              <XCircle className="h-4 w-4" /> Contras
                            </h4>
                            <ul className="space-y-1.5">
                              {contrasList.map((contra, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-sm text-red-900">
                                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                                  {contra}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Para quem é */}
                    {pp.indicadoPara && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-blue-800 mb-1">Para quem é esse produto?</p>
                            <p className="text-sm text-blue-700 leading-relaxed">{pp.indicadoPara}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}

            {/* Seções complementares */}
            {conteudo.secoes_complementares?.map((secao, i) => {
              const paras: string[] =
                (secao as unknown as Record<string, unknown>).paragrafos as string[] ?? secao.conteudo ?? [];
              return (
                <section key={i} id={`secao-${i}`} className="mb-10 bg-white rounded-2xl p-6 md:p-8 border border-nude-400 shadow-sm">
                  <h2 className="font-serif text-2xl font-bold text-cafe-800 mb-4 pb-2 border-b border-nude-300">
                    {secao.titulo_h2}
                  </h2>
                  {paras.map((p, j) => (
                    <p key={j} className="text-cafe-700 leading-relaxed mb-4 last:mb-0">{p}</p>
                  ))}
                </section>
              );
            })}

            {/* FAQ */}
            {conteudo.faq && conteudo.faq.length > 0 && (
              <section id="faq" className="mb-10 bg-white rounded-2xl p-6 md:p-8 border border-nude-400 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-cafe-800 mb-6 pb-2 border-b border-nude-300">
                  Perguntas Frequentes
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {conteudo.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left font-medium text-cafe-800">
                        {item.pergunta}
                      </AccordionTrigger>
                      <AccordionContent className="text-cafe-600 leading-relaxed">
                        {item.resposta}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Conclusão */}
            {conteudo.conclusao && (
              <section id="conclusao" className="mb-10 bg-white rounded-2xl p-6 md:p-8 border border-nude-400 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-cafe-800 mb-4 pb-2 border-b border-nude-300">
                  {(conteudo.conclusao as unknown as Record<string, unknown>).titulo_h2 as string ?? "Conclusão"}
                </h2>
                {((conteudo.conclusao as unknown as Record<string, unknown>).paragrafos as string[] | undefined
                  ?? [conteudo.conclusao.paragrafo1, conteudo.conclusao.paragrafo2, conteudo.conclusao.paragrafo3])
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i} className="text-cafe-700 leading-relaxed mb-4 last:mb-0">{p as string}</p>
                  ))}
              </section>
            )}

            {/* Bloco editorial */}
            {conteudo.bloco_editorial && (
              <aside className="mb-10 bg-brand-50 border border-brand-200 rounded-xl p-6">
                {typeof conteudo.bloco_editorial === "string" ? (
                  <p className="text-sm text-brand-700 leading-relaxed italic">
                    {conteudo.bloco_editorial as unknown as string}
                  </p>
                ) : (
                  <>
                    <h3 className="font-serif font-bold text-brand-700 mb-2">{conteudo.bloco_editorial.titulo}</h3>
                    <p className="text-sm text-brand-600 leading-relaxed">{conteudo.bloco_editorial.texto}</p>
                  </>
                )}
              </aside>
            )}

            {/* Autora */}
            <AuthorBox publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
          </main>

          {/* ── SIDEBAR (desktop) ── */}
          {sidebarItems.length > 0 && (
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <RankingSidebar items={sidebarItems} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Artigos relacionados */}
      {related.length > 0 && (
        <div className="border-t border-nude-400 mt-4 pt-12 pb-12 bg-white">
          <div className="container max-w-6xl">
            <h2 className="font-serif text-2xl font-bold text-cafe-800 mb-6">Você também pode gostar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rp) => (
                <ReviewCard
                  key={rp.id}
                  slug={rp.slug}
                  titulo={rp.titulo}
                  resumo={rp.resumo}
                  categoria={rp.categoria}
                  tipo={rp.tipo}
                  publishedAt={rp.publishedAt}
                  imagemUrl={rp.imagemUrl}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
