-- AlterTable
ALTER TABLE "Post" ADD COLUMN "imagemUrl" TEXT;
ALTER TABLE "Post" ADD COLUMN "urlAmazon" TEXT;
ALTER TABLE "Post" ADD COLUMN "urlMercadoLivre" TEXT;
ALTER TABLE "Post" ADD COLUMN "urlShopee" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AISettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL DEFAULT 'anthropic',
    "apiKey" TEXT,
    "model" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "promptRanking" TEXT,
    "promptIndividual" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AISettings" ("apiKey", "ativo", "createdAt", "id", "model", "promptIndividual", "promptRanking", "provider", "updatedAt") SELECT "apiKey", "ativo", "createdAt", "id", "model", "promptIndividual", "promptRanking", "provider", "updatedAt" FROM "AISettings";
DROP TABLE "AISettings";
ALTER TABLE "new_AISettings" RENAME TO "AISettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
