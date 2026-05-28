/*
  Warnings:

  - You are about to drop the `projectTechnologies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "projectTechnologies" DROP CONSTRAINT "projectTechnologies_projectId_fkey";

-- DropForeignKey
ALTER TABLE "projectTechnologies" DROP CONSTRAINT "projectTechnologies_studentId_fkey";

-- DropTable
DROP TABLE "projectTechnologies";
