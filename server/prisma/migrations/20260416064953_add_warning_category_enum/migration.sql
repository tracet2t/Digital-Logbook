/*
  Warnings:

  - The `warningType` column on the `warningStatuses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WarningCategory" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "warningStatuses" DROP COLUMN "warningType",
ADD COLUMN     "warningType" "WarningCategory";
