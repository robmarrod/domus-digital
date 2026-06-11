/**
 * Next.js Instrumentation Hook — roda UMA VEZ na inicialização do servidor.
 * Cria todas as tabelas via SQL puro se não existirem, sem depender do binário
 * do Prisma CLI (migrate deploy), que pode não ter permissão de execução na Hostinger.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // Normaliza DATABASE_URL — alguns painéis removem o prefixo "file:"
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    process.env.DATABASE_URL = "file:" + process.env.DATABASE_URL;
  }

  try {
    const { prisma } = await import("./lib/prisma");

    // CREATE TABLE IF NOT EXISTS para cada modelo — seguro de rodar múltiplas vezes
    const createStatements = [
      `CREATE TABLE IF NOT EXISTS "Post" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "titulo" TEXT NOT NULL,
        "resumo" TEXT NOT NULL,
        "conteudoJson" TEXT NOT NULL,
        "tipo" TEXT NOT NULL,
        "categoria" TEXT NOT NULL,
        "palavraPrimaria" TEXT NOT NULL,
        "metaTitle" TEXT NOT NULL,
        "metaDescription" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'DRAFT',
        "publishedAt" DATETIME,
        "scheduledAt" DATETIME,
        "linksJson" TEXT,
        "parentPostId" TEXT,
        "imagemUrl" TEXT,
        "urlShopee" TEXT,
        "urlMercadoLivre" TEXT,
        "urlAmazon" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "nome" TEXT NOT NULL,
        "descricaoCurta" TEXT NOT NULL,
        "categoria" TEXT NOT NULL,
        "imagemUrl" TEXT,
        "marca" TEXT,
        "precoReferencial" REAL,
        "idShopee" TEXT,
        "idMercadoLivre" TEXT,
        "idAmazon" TEXT,
        "urlShopee" TEXT,
        "urlMercadoLivre" TEXT,
        "urlAmazon" TEXT,
        "prosDefault" TEXT,
        "contrasDefault" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "PostProduct" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "postId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "posicao" INTEGER NOT NULL,
        "rotuloDestaque" TEXT,
        "resumoCurto" TEXT,
        "pros" TEXT,
        "contras" TEXT,
        "indicadoPara" TEXT,
        UNIQUE ("postId", "posicao"),
        FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE,
        FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS "AISettings" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "provider" TEXT NOT NULL DEFAULT 'anthropic',
        "apiKey" TEXT,
        "model" TEXT,
        "ativo" BOOLEAN NOT NULL DEFAULT false,
        "promptRanking" TEXT,
        "promptIndividual" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "AffiliateSettings" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "amazonTag" TEXT,
        "shopeeParam" TEXT,
        "mercadoLivreParam" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
    ];

    for (const sql of createStatements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (e: unknown) {
        const msg = (e as Error).message ?? "";
        if (!msg.includes("already exists")) {
          console.error("[instrumentation] Erro CREATE TABLE:", msg.slice(0, 150));
        }
      }
    }

    // ALTER TABLE para colunas que podem ter sido adicionadas depois
    const alterStatements = [
      `ALTER TABLE "Post" ADD COLUMN "scheduledAt" DATETIME`,
      `ALTER TABLE "Post" ADD COLUMN "linksJson" TEXT`,
      `ALTER TABLE "Post" ADD COLUMN "parentPostId" TEXT`,
      `ALTER TABLE "Post" ADD COLUMN "imagemUrl" TEXT`,
      `ALTER TABLE "Post" ADD COLUMN "urlShopee" TEXT`,
      `ALTER TABLE "Post" ADD COLUMN "urlMercadoLivre" TEXT`,
      `ALTER TABLE "Post" ADD COLUMN "urlAmazon" TEXT`,
      `ALTER TABLE "AISettings" ADD COLUMN "promptRanking" TEXT`,
      `ALTER TABLE "AISettings" ADD COLUMN "promptIndividual" TEXT`,
    ];

    for (const sql of alterStatements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch {
        // coluna já existe — ignorar
      }
    }

    console.log("[instrumentation] ✅ DB schema criado/verificado com sucesso.");
  } catch (e: unknown) {
    console.error("[instrumentation] Falha crítica:", (e as Error).message);
  }
}
