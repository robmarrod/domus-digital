/**
 * server.js — Entry point customizado para Hostinger.
 * 1. Cria o diretório do banco SQLite se não existir.
 * 2. Roda prisma migrate deploy (cria/atualiza todas as tabelas).
 * 3. Inicia o Next.js normalmente.
 *
 * Funciona independente de como a Hostinger inicia o processo
 * (npm start, node server.js, etc.).
 */

const { createServer } = require("http");
const { parse } = require("url");
const { spawnSync } = require("child_process");
const { mkdirSync, existsSync } = require("fs");
const path = require("path");

// ── 0. Normaliza DATABASE_URL — some painéis removem o prefixo "file:" ────────
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
  process.env.DATABASE_URL = "file:" + process.env.DATABASE_URL;
  console.log("[server.js] DATABASE_URL normalizado para:", process.env.DATABASE_URL);
}

const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

// ── 1. Garante que o diretório do banco existe ────────────────────────────────

function ensureDbDir() {
  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl.startsWith("file:")) return;
  const filePath = dbUrl.replace("file:", "");
  const dir = filePath.substring(0, filePath.lastIndexOf("/"));
  if (dir && !existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log("[server.js] ✅ Diretório do banco criado:", dir);
  }
}

// ── 2. Roda prisma migrate deploy ─────────────────────────────────────────────

function runMigrations() {
  console.log("[server.js] 🔄 Rodando prisma migrate deploy...");
  const prismaBin = path.join(__dirname, "node_modules", ".bin", "prisma");
  const result = spawnSync(prismaBin, ["migrate", "deploy"], {
    stdio: "inherit",
    env: { ...process.env },
    timeout: 60000,
  });
  if (result.status === 0) {
    console.log("[server.js] ✅ Migrations aplicadas.");
  } else {
    console.warn("[server.js] ⚠ prisma migrate deploy retornou código:", result.status, "— continuando...");
  }
}

// ── 3. Inicia o Next.js ───────────────────────────────────────────────────────

async function main() {
  ensureDbDir();
  runMigrations();

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
