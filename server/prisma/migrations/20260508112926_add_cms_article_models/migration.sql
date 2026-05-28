-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "isHero" BOOLEAN NOT NULL DEFAULT false,
    "isEvent" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articleTags" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "articleTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articleSeo" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "ogImage" TEXT,

    CONSTRAINT "articleSeo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articleEvents" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "eventTime" TEXT,
    "location" TEXT,
    "tag" TEXT,

    CONSTRAINT "articleEvents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articleTags_articleId_label_key" ON "articleTags"("articleId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "articleSeo_articleId_key" ON "articleSeo"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "articleEvents_articleId_key" ON "articleEvents"("articleId");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articleTags" ADD CONSTRAINT "articleTags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articleSeo" ADD CONSTRAINT "articleSeo_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articleEvents" ADD CONSTRAINT "articleEvents_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
