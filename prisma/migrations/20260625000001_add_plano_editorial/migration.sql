-- CreateTable
CREATE TABLE "PlanoEditorial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" INTEGER NOT NULL,
    "produto" TEXT NOT NULL,
    "comodo" TEXT NOT NULL,
    "keywordPrincipal" TEXT NOT NULL,
    "variacao1" TEXT,
    "variacao2" TEXT,
    "variacao3" TEXT,
    "tituloH1" TEXT NOT NULL,
    "intencaoBusca" TEXT NOT NULL,
    "volumeEstimado" INTEGER NOT NULL,
    "sd" INTEGER NOT NULL,
    "ticket" TEXT NOT NULL,
    "comissaoMin" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "statusPlan" TEXT NOT NULL DEFAULT 'A criar',
    "concorrentes" TEXT,
    "postSlug" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanoEditorial_numero_key" ON "PlanoEditorial"("numero");
