import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  amazonTag: z.string().optional().default(""),
  shopeeParam: z.string().optional().default(""),
  mercadoLivreParam: z.string().optional().default(""),
});

export async function GET() {
  const settings = await prisma.affiliateSettings.findFirst();
  return NextResponse.json(
    settings ?? { amazonTag: null, shopeeParam: null, mercadoLivreParam: null }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.affiliateSettings.findFirst();

    const settings = existing
      ? await prisma.affiliateSettings.update({
          where: { id: existing.id },
          data: {
            amazonTag: data.amazonTag || null,
            shopeeParam: data.shopeeParam || null,
            mercadoLivreParam: data.mercadoLivreParam || null,
          },
        })
      : await prisma.affiliateSettings.create({
          data: {
            amazonTag: data.amazonTag || null,
            shopeeParam: data.shopeeParam || null,
            mercadoLivreParam: data.mercadoLivreParam || null,
          },
        });

    return NextResponse.json(settings);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
