-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PostProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "posicao" INTEGER NOT NULL,
    "rotuloDestaque" TEXT,
    "resumoCurto" TEXT,
    "pros" TEXT,
    "contras" TEXT,
    "indicadoPara" TEXT,
    CONSTRAINT "PostProduct_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AffiliateSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amazonTag" TEXT,
    "shopeeParam" TEXT,
    "mercadoLivreParam" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PostProduct_postId_posicao_key" ON "PostProduct"("postId", "posicao");
