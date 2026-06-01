import { Article, ArticleStatus, Role } from "@prisma/client";

import prisma from "@/lib/prisma";

import BaseRepository from "./baseRepository";

export class ArticleRepository extends BaseRepository<Article> {
  constructor() {
    super(prisma.article);
  }

  /**
   * Create an article. Only superAdmin users are permitted — enforced here
   * in addition to the API/route layer.
   */
  async createArticle(data: {
    authorId: string;
    authorRole: Role;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    isHero?: boolean;
    isEvent?: boolean;
    status?: ArticleStatus;
    tags?: string[];
    seo?: { metaTitle?: string; metaDesc?: string; ogImage?: string };
    event?: {
      eventDate?: Date;
      eventTime?: string;
      location?: string;
      tag?: string;
    };
  }) {
    if (data.authorRole !== Role.superAdmin) {
      throw new Error("Forbidden: only superAdmin can create articles.");
    }

    const { tags, seo, event, authorRole, ...articleData } = data;

    return prisma.article.create({
      data: {
        ...articleData,
        tags: tags?.length
          ? { create: tags.map((label) => ({ label })) }
          : undefined,
        seo: seo ? { create: seo } : undefined,
        event: event ? { create: event } : undefined,
      },
      include: { tags: true, seo: true, event: true },
    });
  }

  /** Update an article. Only the owning superAdmin may update. */
  async updateArticle(
    id: string,
    requesterId: string,
    requesterRole: Role,
    data: Partial<{
      title: string;
      slug: string;
      content: string;
      excerpt: string;
      isHero: boolean;
      isEvent: boolean;
      status: ArticleStatus;
      publishedAt: Date | null;
    }>,
  ) {
    if (requesterRole !== Role.superAdmin) {
      throw new Error("Forbidden: only superAdmin can update articles.");
    }

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) throw new Error("Article not found.");
    if (article.authorId !== requesterId) {
      throw new Error("Forbidden: you can only edit your own articles.");
    }

    return prisma.article.update({ where: { id }, data });
  }

  /** Delete an article. Only the owning superAdmin may delete. */
  async deleteArticle(id: string, requesterId: string, requesterRole: Role) {
    if (requesterRole !== Role.superAdmin) {
      throw new Error("Forbidden: only superAdmin can delete articles.");
    }

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) throw new Error("Article not found.");
    if (article.authorId !== requesterId) {
      throw new Error("Forbidden: you can only delete your own articles.");
    }

    return prisma.article.delete({ where: { id } });
  }

  /** List all articles (admin view) — superAdmin only. */
  async listAll(requesterRole: Role) {
    if (requesterRole !== Role.superAdmin) {
      throw new Error("Forbidden: only superAdmin can list all articles.");
    }

    return prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: { tags: true, event: true },
    });
  }

  /** List only published articles (public / landing page view). */
  async listPublished() {
    return prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      include: { tags: true, event: true },
    });
  }

  /** Find a single article by slug (public). */
  async findBySlug(slug: string) {
    return prisma.article.findUnique({
      where: { slug },
      include: { tags: true, seo: true, event: true },
    });
  }

  /** Publish an article (sets status + publishedAt). SuperAdmin only. */
  async publish(id: string, requesterId: string, requesterRole: Role) {
    return this.updateArticle(id, requesterId, requesterRole, {
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date(),
    });
  }

  /** Archive an article. SuperAdmin only. */
  async archive(id: string, requesterId: string, requesterRole: Role) {
    return this.updateArticle(id, requesterId, requesterRole, {
      status: ArticleStatus.ARCHIVED,
    });
  }
}
