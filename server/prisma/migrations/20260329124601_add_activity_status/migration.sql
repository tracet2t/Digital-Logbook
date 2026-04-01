-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "status" "ActivityStatus" NOT NULL DEFAULT 'pending';
