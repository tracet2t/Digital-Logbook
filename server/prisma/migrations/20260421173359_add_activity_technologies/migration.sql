-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[];
