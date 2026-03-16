/*
  Warnings:

  - The values [super_admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `mentoractivities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentorship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_badges` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('student', 'mentor', 'superAdmin');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "invitations" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_invitedBy_fkey";

-- DropForeignKey
ALTER TABLE "mentoractivities" DROP CONSTRAINT "mentoractivities_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "mentorship" DROP CONSTRAINT "mentorship_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "mentorship" DROP CONSTRAINT "mentorship_studentId_fkey";

-- DropForeignKey
ALTER TABLE "project_assignments" DROP CONSTRAINT "project_assignments_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_assignments" DROP CONSTRAINT "project_assignments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "user_badges" DROP CONSTRAINT "user_badges_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "user_badges" DROP CONSTRAINT "user_badges_userId_fkey";

-- AlterTable
ALTER TABLE "invitations" ALTER COLUMN "invitedBy" DROP NOT NULL;

-- DropTable
DROP TABLE "mentoractivities";

-- DropTable
DROP TABLE "mentorship";

-- DropTable
DROP TABLE "project_assignments";

-- DropTable
DROP TABLE "user_badges";

-- CreateTable
CREATE TABLE "mentorActivities" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "workingHours" INTEGER NOT NULL,
    "activities" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentorActivities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectAssignments" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projectAssignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectMentors" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projectMentors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userBadges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userBadges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projectAssignments_projectId_studentId_key" ON "projectAssignments"("projectId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "projectMentors_projectId_mentorId_key" ON "projectMentors"("projectId", "mentorId");

-- AddForeignKey
ALTER TABLE "mentorActivities" ADD CONSTRAINT "mentorActivities_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectAssignments" ADD CONSTRAINT "projectAssignments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectAssignments" ADD CONSTRAINT "projectAssignments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectMentors" ADD CONSTRAINT "projectMentors_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectMentors" ADD CONSTRAINT "projectMentors_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userBadges" ADD CONSTRAINT "userBadges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userBadges" ADD CONSTRAINT "userBadges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
