import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  provider: z.enum(["anthropic", "openai", "gemini"]),
  apiKey: z.string().min(1),
  model: z.string().optional(),
  ativo: z.boolean().optional(),
  promptRanking: z.string().optional(),
  promptIndividual: z.string().optional(),
});

export async function GET() {
  try {
    // Retorna todas as configs (sem expor a key completa)
    const configs = await prisma.aISettings.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        provider: true,
        model: true,
        ativo: true,
        updatedAt: true,
        // Máscara da key: apenas últimos 4 chars
        apiKey: true,
      },
    });

    const masked = configs.map((c) => ({
      ...c,
      apiKeyMasked: c.apiKey ? "••••••••" + c.apiKey.slice(-4) : null,
      apiKey: undefined,
    }));

    return NextResponse.json(masked);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { provider, apiKey, model, ativo, promptRanking, promptIndividual } = parsed.data;

    // Se ativar este, desativa os outros
    if (ativo) {
      await prisma.aISettings.updateMany({ data: { ativo: false } });
    }

    // Upsert por provider
    const existing = await prisma.aISettings.findFirst({ where: { provider } });
    let config;
    if (existing) {
      const updateData: Record<string, unknown> = { model: model || null, ativo: ativo ?? false };
      // Só atualiza a apiKey se não for a string especial "MANTER"
      if (apiKey !== "MANTER") updateData.apiKey = apiKey;
      if (promptRanking !== undefined) updateData.promptRanking = promptRanking || null;
      if (promptIndividual !== undefined) updateData.promptIndividual = promptIndividual || null;
      config = await prisma.aISettings.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      config = await prisma.aISettings.create({
        data: {
          provider, apiKey, model: model || null, ativo: ativo ?? false,
          promptRanking: promptRanking || null,
          promptIndividual: promptIndividual || null,
        },
      });
    }

    return NextResponse.json({ ok: true, id: config.id, provider: config.provider });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.aISettings.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
