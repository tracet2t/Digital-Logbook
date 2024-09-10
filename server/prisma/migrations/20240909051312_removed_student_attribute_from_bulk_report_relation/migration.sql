/*
  Warnings:

  - You are about to drop the column `studentId` on the `reports` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_studentId_fkey";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "studentId";
