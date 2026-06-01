/*
  Warnings:

  - You are about to drop the column `featuredImage` on the `articles` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ArticleImageType" AS ENUM ('COVER', 'GALLERY');

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "featuredImage";

-- CreateTable
CREATE TABLE "articleImages" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "ArticleImageType" NOT NULL DEFAULT 'GALLERY',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articleImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "articleImages" ADD CONSTRAINT "articleImages_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
