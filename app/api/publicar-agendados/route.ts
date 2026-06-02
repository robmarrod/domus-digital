/**
 * Rota de cron: publica posts com status SCHEDULED cuja scheduledAt <= agora.
 * Configure na Hostinger (ou qualquer cron) para chamar este endpoint a cada 5-15 minutos:
 *   GET https://achadinhosdaelis.com.br/api/publicar-agendados?secret=SEU_ADMIN_SECRET
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const agora = new Date();

    const posts = await prisma.post.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lte: agora },
      },
      select: { id: true, titulo: true, scheduledAt: true },
    });

    if (posts.length === 0) {
      return NextResponse.json({ publicados: 0, mensagem: "Nenhum post agendado para publicar." });
    }

    const ids = posts.map((p) => p.id);

    await prisma.post.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "PUBLISHED",
        publishedAt: agora,
      },
    });

    return NextResponse.json({
      publicados: posts.length,
      posts: posts.map((p) => ({ id: p.id, titulo: p.titulo, agendadoPara: p.scheduledAt })),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
