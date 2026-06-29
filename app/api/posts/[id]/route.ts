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

const updatePostSchema = z.object({
  titulo: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  palavraPrimaria: z.string().optional(),
  categoria: z.string().min(1).optional(),
  tipo: z.preprocess((v) => (v === "RANKING" ? "REVIEW" : v), z.enum(["REVIEW", "GUIA", "PRODUTO"]).optional()),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  resumo: z.string().optional(),
  conteudoJson: z.string().optional().refine((v) => {
    if (!v) return true;
    try { JSON.parse(v); return true; } catch { return false; }
  }, "conteudoJson must be valid JSON"),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  linksJson: z.string().nullable().optional(),
  imagemUrl: z.preprocess((v) => (v === "" ? null : v), z.string().url().optional().nullable()),
  urlShopee: z.string().nullable().optional(),
  urlMercadoLivre: z.string().nullable().optional(),
  urlAmazon: z.string().nullable().optional(),
  parentPostId: z.string().nullable().optional(),
  postProducts: z.array(postProductSchema).optional(),
});

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      postProducts: {
        orderBy: { posicao: "asc" },
        include: { product: true },
      },
    },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json();
    const data = updatePostSchema.parse(body);

    const existing = await prisma.post.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const publishedAt =
      data.status === "PUBLISHED" && !existing.publishedAt
        ? new Date()
        : existing.publishedAt;

    const post = await prisma.$transaction(async (tx) => {
      const updated = await tx.post.update({
        where: { id: params.id },
        data: {
          ...(data.titulo && { titulo: data.titulo }),
          ...(data.slug && { slug: data.slug }),
          ...(data.palavraPrimaria !== undefined && { palavraPrimaria: data.palavraPrimaria }),
          ...(data.categoria && { categoria: data.categoria }),
          ...(data.tipo && { tipo: data.tipo }),
          ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
          ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
          ...(data.resumo !== undefined && { resumo: data.resumo }),
          ...(data.conteudoJson && { conteudoJson: data.conteudoJson }),
          ...(data.status && { status: data.status }),
          publishedAt,
          ...(data.scheduledAt !== undefined && {
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
          }),
          ...(data.linksJson !== undefined && { linksJson: data.linksJson }),
          ...(data.imagemUrl !== undefined && { imagemUrl: data.imagemUrl ?? null }),
          ...(data.parentPostId !== undefined && { parentPostId: data.parentPostId ?? null }),
          ...(data.urlShopee !== undefined && { urlShopee: data.urlShopee ?? null }),
          ...(data.urlMercadoLivre !== undefined && { urlMercadoLivre: data.urlMercadoLivre ?? null }),
          ...(data.urlAmazon !== undefined && { urlAmazon: data.urlAmazon ?? null }),
        },
      });

      if (data.postProducts !== undefined) {
        await tx.postProduct.deleteMany({ where: { postId: params.id } });
        if (data.postProducts.length > 0) {
          await tx.postProduct.createMany({
            data: data.postProducts.map((pp) => ({
              postId: params.id,
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
      }

      return updated;
    });

    return NextResponse.json(post);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: e.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
