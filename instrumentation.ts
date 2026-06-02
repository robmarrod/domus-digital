/**
 * Next.js Instrumentation Hook — roda UMA VEZ na inicialização do servidor.
 * Garante que as colunas novas existam no banco SQLite, independente de como
 * a Hostinger inicia o app (com ou sem prestart/npm start).
 */
export async function register() {
  // Só roda no Node.js runtime (não no Edge runtime)
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { prisma } = await import("./lib/prisma");

    // Cada statement em try/catch individual:
    // se a coluna já existir, o erro é ignorado e o próximo roda normalmente.
    const statements = [
      // Post — novas colunas
      `ALTER TABLE "Post" ADD COLUMN "scheduledAt" DATETIME`,
      `ALTER TABLE "Post" ADD COLUMN "linksJson" TEXT`,
      `ALTER TABLE "Post" ADD COLUMN "parentPostId" TEXT`,

      // AISettings — cria se não existir
      `CREATE TABLE IF NOT EXISTS "AISettings" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "provider" TEXT NOT NULL DEFAULT 'anthropic',
        "apiKey" TEXT,
        "model" TEXT,
        "ativo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      // AISettings — colunas de prompt
      `ALTER TABLE "AISettings" ADD COLUMN "promptRanking" TEXT`,
      `ALTER TABLE "AISettings" ADD COLUMN "promptIndividual" TEXT`,

      // Post — imagem de capa
      `ALTER TABLE "Post" ADD COLUMN "imagemUrl" TEXT`,

      // Post — links de compra diretos (para posts individuais sem produto vinculado)
      `ALTER TABLE "Post" ADD COLUMN "urlShopee" TEXT`,
      `ALTER TABLE "Post" ADD COLUMN "urlMercadoLivre" TEXT`,
      `ALTER TABLE "Post" ADD COLUMN "urlAmazon" TEXT`,
    ];

    for (const sql of statements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (e: unknown) {
        const msg = (e as Error).message ?? "";
        // "duplicate column name" = coluna já existe = OK
        // "table AISettings already exists" = tabela já existe = OK
        if (!msg.includes("duplicate column") && !msg.includes("already exists")) {
          console.error("[instrumentation] SQL error:", msg, "\nSQL:", sql.slice(0, 80));
        }
      }
    }

    console.log("[instrumentation] ✅ DB schema verificado e atualizado.");
  } catch (e: unknown) {
    console.error("[instrumentation] Falha crítica no DB sync:", (e as Error).message);
    // Não re-throw — deixa o app iniciar mesmo assim
  }
}
