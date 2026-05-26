/*
  Warnings:

  - Added the required column `address` to the `menteeApplications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNumber` to the `menteeApplications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nic` to the `menteeApplications` table without a default value. This is not possible if the table is not empty.

*/
/*
  Warnings:

  - Added the required column `address` to the `menteeApplications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNumber` to the `menteeApplications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nic` to the `menteeApplications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - add columns with temporary defaults for existing rows
ALTER TABLE "menteeApplications" ADD COLUMN     "address" TEXT DEFAULT '' NOT NULL,
ADD COLUMN     "mobileNumber" TEXT DEFAULT '' NOT NULL,
ADD COLUMN     "nic" TEXT DEFAULT '' NOT NULL;

-- Remove defaults so new rows must provide values
ALTER TABLE "menteeApplications" ALTER COLUMN "address" DROP DEFAULT,
ALTER COLUMN "mobileNumber" DROP DEFAULT,
ALTER COLUMN "nic" DROP DEFAULT;
