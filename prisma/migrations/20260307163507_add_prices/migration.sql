-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "price" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "PriceItem" (
    "id" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PriceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceItem_itemKey_key" ON "PriceItem"("itemKey");
