-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "domain" TYPE TEXT USING "domain"::text;

-- DropEnum
DROP TYPE "ProjectDomain";
