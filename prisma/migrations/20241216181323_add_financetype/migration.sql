/*
  Warnings:

  - You are about to drop the column `type` on the `FinancialRecords` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FinancialRecords` table. All the data in the column will be lost.
  - Added the required column `type_id` to the `FinancialRecords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FinancialRecords` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FinancialRecords" DROP CONSTRAINT "FinancialRecords_userId_fkey";

-- AlterTable
ALTER TABLE "FinancialRecords" DROP COLUMN "type",
DROP COLUMN "userId",
ADD COLUMN     "type_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FinanceType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FinanceType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FinancialRecords" ADD CONSTRAINT "FinancialRecords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRecords" ADD CONSTRAINT "FinancialRecords_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "FinanceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
