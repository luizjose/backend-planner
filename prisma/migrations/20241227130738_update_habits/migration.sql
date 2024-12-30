/*
  Warnings:

  - You are about to drop the column `frequency` on the `Habits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Habits" DROP COLUMN "frequency";

-- CreateTable
CREATE TABLE "HabitDays" (
    "id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "HabitDays_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HabitDays" ADD CONSTRAINT "HabitDays_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "Habits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
