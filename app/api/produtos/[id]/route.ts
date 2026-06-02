import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateProductSchema = z.object({
  slug: z.string().min(1).optional(),
  nome: z.string().min(1).optional(),
  descricaoCurta: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  imagemUrl: z.string().nullable().optional(),
  marca: z.string().nullable().optional(),
  precoReferencial: z.number().nullable().optional(),
  idShopee: z.string().nullable().optional(),
  idMercadoLivre: z.string().nullable().optional(),
  idAmazon: z.string().nullable().optional(),
  urlShopee: z.string().nullable().optional(),
  urlMercadoLivre: z.string().nullable().optional(),
  urlAmazon: z.string().nullable().optional(),
  prosDefault: z.string().nullable().optional(),
  contrasDefault: z.string().nullable().optional(),
});

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json();
    const data = updateProductSchema.parse(body);

    const product = await prisma.product.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(product);
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
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
