-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "reviewComment" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT;

-- CreateIndex
CREATE INDEX "Document_reviewedById_idx" ON "Document"("reviewedById");

-- CreateIndex
CREATE INDEX "Document_reviewedAt_idx" ON "Document"("reviewedAt");

-- CreateIndex
CREATE INDEX "Document_createdAt_idx" ON "Document"("createdAt");
