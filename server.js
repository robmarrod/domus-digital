/**
 * server.js — Entry point customizado para Hostinger.
 * 1. Roda as migrations SQL diretamente (idempotente).
 * 2. Inicia o Next.js normalmente.
 *
 * Funciona independente de como a Hostinger inicia o processo
 * (npm start, node server.js, etc.).
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

// ── 1. Migrations diretas via Prisma ─────────────────────────────────────────

async function ensureSchema() {
  try {
    // Importa o PrismaClient já gerado durante o build
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    const statements = [
      `ALTER TABLE "Post" ADD COLUMN "scheduledAt" DATETIME`,
      `ALTER TABLE "Post" ADD COLUMN "linksJson"    TEXT`,
      `ALTER TABLE "Post" ADD COLUMN "parentPostId" TEXT`,
      `CREATE TABLE IF NOT EXISTS "AISettings" (
         "id"       TEXT NOT NULL PRIMARY KEY,
         "provider" TEXT NOT NULL DEFAULT 'anthropic',
         "apiKey"   TEXT,
         "model"    TEXT,
         "ativo"    BOOLEAN NOT NULL DEFAULT false,
         "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
         "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
       )`,
      `ALTER TABLE "AISettings" ADD COLUMN "promptRanking"    TEXT`,
      `ALTER TABLE "AISettings" ADD COLUMN "promptIndividual" TEXT`,
      `ALTER TABLE "Post"       ADD COLUMN "imagemUrl"        TEXT`,
    ];

    for (const sql of statements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (e) {
        const msg = e.message || "";
        // "duplicate column name" = coluna já existe → OK, ignorar
        if (!msg.includes("duplicate column") && !msg.includes("already exists")) {
          console.warn("[server.js] SQL aviso:", msg.slice(0, 120));
        }
      }
    }

    await prisma.$disconnect();
    console.log("[server.js] ✅ Schema verificado.");
  } catch (err) {
    // Nunca bloqueia o startup
    console.warn("[server.js] ⚠ ensureSchema falhou (não crítico):", err.message);
  }
}

// ── 2. Inicia o Next.js ───────────────────────────────────────────────────────

async function main() {
  await ensureSchema();

  const app = next({ dev, port });
  const handle = app.getRequestHandler();

  await app.prepare();

  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, "0.0.0.0", () => {
    console.log(`[server.js] ✅ Pronto em http://0.0.0.0:${port}`);
  });
}

main().catch((err) => {
  console.error("[server.js] Erro fatal:", err);
  process.exit(1);
});
