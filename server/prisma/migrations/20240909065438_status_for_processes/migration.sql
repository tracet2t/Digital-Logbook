-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('pending', 'error', 'completed', 'wip');

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "status" "ProcessStatus" NOT NULL DEFAULT 'pending';
