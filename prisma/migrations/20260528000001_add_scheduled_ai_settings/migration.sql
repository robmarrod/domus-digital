-- AlterTable: add scheduledAt to Post
ALTER TABLE "Post" ADD COLUMN "scheduledAt" DATETIME;

-- CreateTable: AISettings
CREATE TABLE "AISettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL DEFAULT 'anthropic',
    "apiKey" TEXT,
    "model" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
