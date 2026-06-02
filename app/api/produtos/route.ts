import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createProductSchema = z.object({
  slug: z.string().min(1),
  nome: z.string().min(1),
  descricaoCurta: z.string().min(1),
  categoria: z.string().min(1),
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoria = searchParams.get("categoria");

  const products = await prisma.product.findMany({
    where: categoria ? { categoria } : undefined,
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createProductSchema.parse(body);
    const product = await prisma.product.create({ data });
    return NextResponse.json(product, { status: 201 });
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
