import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    node: process.version,
    env: process.env.NODE_ENV,
  };

  // 1. Testa conexão básica
  try {
    await prisma.$queryRaw`SELECT 1 as ok`;
    checks.db_connection = "ok";
  } catch (e) {
    checks.db_connection = "FAILED: " + (e as Error).message;
  }

  // 2. Testa colunas do Post
  try {
    const cols = await prisma.$queryRaw<{ name: string }[]>`
      PRAGMA table_info("Post")
    `;
    checks.post_columns = (cols as Array<{ name: string }>).map((c) => c.name);
  } catch (e) {
    checks.post_columns = "FAILED: " + (e as Error).message;
  }

  // 3. Testa tabela AISettings
  try {
    const tables = await prisma.$queryRaw<{ name: string }[]>`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
    `;
    checks.tables = (tables as Array<{ name: string }>).map((t) => t.name);
  } catch (e) {
    checks.tables = "FAILED: " + (e as Error).message;
  }

  // 4. Tenta query real no Post
  try {
    const count = await prisma.post.count();
    checks.post_count = count;
  } catch (e) {
    checks.post_query = "FAILED: " + (e as Error).message;
  }

  // 5. DATABASE_URL (sem expor o caminho completo)
  const dbUrl = process.env.DATABASE_URL || "not set";
  checks.db_url_prefix = dbUrl.slice(0, 30) + "...";

  return NextResponse.json(checks, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
