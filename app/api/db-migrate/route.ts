/**
 * /api/db-migrate?secret=achadinhos2024
 *
 * Endpoint de migração manual — aplica todas as colunas/tabelas novas
 * diretamente via SQL (idempotente: ignora erros de "já existe").
 *
 * Chamar UMA VEZ após o deploy para corrigir o banco na Hostinger.
 * Não requer restart do servidor.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATEMENTS = [
  {
    label: "Post.scheduledAt",
    sql: `ALTER TABLE "Post" ADD COLUMN "scheduledAt" DATETIME`,
  },
  {
    label: "Post.linksJson",
    sql: `ALTER TABLE "Post" ADD COLUMN "linksJson" TEXT`,
  },
  {
    label: "Post.parentPostId",
    sql: `ALTER TABLE "Post" ADD COLUMN "parentPostId" TEXT`,
  },
  {
    label: "AISettings (criar tabela)",
    sql: `CREATE TABLE IF NOT EXISTS "AISettings" (
      "id"       TEXT NOT NULL PRIMARY KEY,
      "provider" TEXT NOT NULL DEFAULT 'anthropic',
      "apiKey"   TEXT,
      "model"    TEXT,
      "ativo"    BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  },
  {
    label: "AISettings.promptRanking",
    sql: `ALTER TABLE "AISettings" ADD COLUMN "promptRanking" TEXT`,
  },
  {
    label: "AISettings.promptIndividual",
    sql: `ALTER TABLE "AISettings" ADD COLUMN "promptIndividual" TEXT`,
  },
];

export async function GET(req: NextRequest) {
  // Proteção simples por secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== (process.env.ADMIN_SECRET ?? "achadinhos2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { label: string; status: "ok" | "skipped" | "error"; detail?: string }[] = [];

  for (const { label, sql } of STATEMENTS) {
    try {
      await prisma.$executeRawUnsafe(sql);
      results.push({ label, status: "ok" });
    } catch (e: unknown) {
      const msg = (e as Error).message ?? "";
      if (msg.includes("duplicate column") || msg.includes("already exists")) {
        results.push({ label, status: "skipped", detail: "já existe" });
      } else {
        results.push({ label, status: "error", detail: msg.slice(0, 200) });
      }
    }
  }

  // Verifica resultado final
  const cols = await prisma.$queryRaw<{ name: string }[]>`PRAGMA table_info("Post")`;
  const tables = await prisma.$queryRaw<{ name: string }[]>`
    SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
  `;

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      results,
      post_columns: (cols as Array<{ name: string }>).map((c) => c.name),
      tables: (tables as Array<{ name: string }>).map((t) => t.name),
      summary: results.every((r) => r.status !== "error")
        ? "✅ Migração concluída com sucesso"
        : "⚠️ Alguns itens falharam — veja 'results'",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
