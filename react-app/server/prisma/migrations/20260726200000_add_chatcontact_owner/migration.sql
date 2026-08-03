-- AlterTable
ALTER TABLE "ChatContact" ADD COLUMN "ownerId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "ChatContact_ownerId_idx" ON "ChatContact"("ownerId");
