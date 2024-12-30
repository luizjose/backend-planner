/*
  Warnings:

  - Added the required column `name` to the `FinancialRecords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinancialRecords" ADD COLUMN     "name" TEXT NOT NULL;
