-- CreateTable
CREATE TABLE "PhysicalCardRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardNumber" TEXT,
    "maskedNumber" TEXT,
    "expiry" TEXT,
    "cvv" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "PhysicalCardRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PhysicalCardRequest_userId_idx" ON "PhysicalCardRequest"("userId");

-- CreateIndex
CREATE INDEX "PhysicalCardRequest_status_idx" ON "PhysicalCardRequest"("status");

-- CreateIndex
CREATE INDEX "PhysicalCardRequest_createdAt_idx" ON "PhysicalCardRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "PhysicalCardRequest" ADD CONSTRAINT "PhysicalCardRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
