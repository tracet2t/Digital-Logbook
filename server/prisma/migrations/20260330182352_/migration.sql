-- CreateEnum
CREATE TYPE "TimeAllocationStatus" AS ENUM ('inReview', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "ProjectAllocations" ADD COLUMN     "timeAllocationStatus" "TimeAllocationStatus" NOT NULL DEFAULT 'inReview';
