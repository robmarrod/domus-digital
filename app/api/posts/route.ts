import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const postProductSchema = z.object({
  productId: z.string().min(1),
  posicao: z.number().int().min(1),
  rotuloDestaque: z.string().optional(),
  resumoCurto: z.string().optional(),
  pros: z.string().optional(),
  contras: z.string().optional(),
  indicadoPara: z.string().optional(),
});

const createPostSchema = z.object({
  titulo: z.string().min(1),
  slug: z.string().min(1),
  palavraPrimaria: z.string().optional().default(""),
  categoria: z.string().min(1),
  // "RANKING" é alias para "REVIEW"; "PRODUTO" para posts individuais
  tipo: z.preprocess((v) => (v === "RANKING" ? "REVIEW" : v), z.enum(["REVIEW", "GUIA", "PRODUTO"])),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  resumo: z.string().optional().default(""),
  conteudoJson: z.string().refine((v) => {
    try { JSON.parse(v); return true; } catch { return false; }
  }, "conteudoJson must be valid JSON"),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
  scheduledAt: z.string().datetime().optional().nullable(),
  // string vazia é tratada como null
  imagemUrl: z.preprocess((v) => (v === "" ? null : v), z.string().url().optional().nullable()),
  urlShopee: z.string().nullable().optional(),
  urlMercadoLivre: z.string().nullable().optional(),
  urlAmazon: z.string().nullable().optional(),
  postProducts: z.array(postProductSchema).optional().default([]),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const categoria = searchParams.get("categoria");

  const posts = await prisma.post.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(categoria ? { categoria } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      titulo: true,
      resumo: true,
      tipo: true,
      categoria: true,
      status: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createPostSchema.parse(body);

    const publishedAt = data.status === "PUBLISHED" ? new Date() : undefined;
    const scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : undefined;

    const post = await prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          slug: data.slug,
          titulo: data.titulo,
          resumo: data.resumo,
          conteudoJson: data.conteudoJson,
          tipo: data.tipo,
          categoria: data.categoria,
          palavraPrimaria: data.palavraPrimaria,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          status: data.status,
          publishedAt,
          scheduledAt,
          imagemUrl: data.imagemUrl ?? null,
          urlShopee: data.urlShopee ?? null,
          urlMercadoLivre: data.urlMercadoLivre ?? null,
          urlAmazon: data.urlAmazon ?? null,
        },
      });

      if (data.postProducts.length > 0) {
        await tx.postProduct.createMany({
          data: data.postProducts.map((pp) => ({
            postId: created.id,
            productId: pp.productId,
            posicao: pp.posicao,
            rotuloDestaque: pp.rotuloDestaque ?? null,
            resumoCurto: pp.resumoCurto ?? null,
            pros: pp.pros ?? null,
            contras: pp.contras ?? null,
            indicadoPara: pp.indicadoPara ?? null,
          })),
        });
      }

      return created;
    });

    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: e.errors },
        { status: 400 }
      );
    }
    const msg = (e as Error).message;
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug já existe" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
