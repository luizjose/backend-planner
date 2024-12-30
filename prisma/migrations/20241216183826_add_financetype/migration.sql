/*
  Warnings:

  - You are about to drop the column `category` on the `FinancialRecords` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `FinancialRecords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinancialRecords" DROP COLUMN "category",
ADD COLUMN     "category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FinancialRecords" ADD CONSTRAINT "FinancialRecords_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "FinancialCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
