-- AlterTable Post: add linksJson and parentPostId
ALTER TABLE "Post" ADD COLUMN "linksJson" TEXT;
ALTER TABLE "Post" ADD COLUMN "parentPostId" TEXT;

-- AlterTable AISettings: add prompt fields
ALTER TABLE "AISettings" ADD COLUMN "promptRanking" TEXT;
ALTER TABLE "AISettings" ADD COLUMN "promptIndividual" TEXT;
