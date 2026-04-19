import { OnboardingRepository } from "@/repositories/onboarding_repository_impl";
import {
  applicationSchema,
  createApplicationSchema,
  getApplicationByEmailSchema,
  getApplicationByIdSchema,
  getApplicationsByDateRangeSchema,
  getApplicationsByStatusSchema,
  searchApplicationsSchema,
  updateApplicationStatusSchema,
} from "@/schemas/onboarding.schema";
import getSession from "@/server_actions/getSession";
import { os } from "@orpc/server";
import { Role } from "@prisma/client";
import { z } from "zod";

import prisma from "@/lib/prisma";

// Initialize repository
const onboardingRepository = new OnboardingRepository();

// Middleware for authentication
const authMiddleware = os.middleware(async ({ next }) => {
  const session = await getSession();

  if (!session || !session.isAuthenticated()) {
    throw new Error("Unauthorized");
  }

  return next({
    context: {
      session,
      userId: session.getId(),
      userRole: session.getRole(),
    },
  });
});

// Middleware for super admin check (requires auth context)
const superAdminMiddleware = os.middleware(async ({ context, next }) => {
  const userRole = (context as any).userRole;

  if (userRole !== Role.superAdmin) {
    throw new Error("Forbidden: Super Admin access required");
  }

  return next();
});

// Base procedures
const publicProcedure = os;
const authedProcedure = publicProcedure.use(authMiddleware);
const superAdminProcedure = authedProcedure.use(superAdminMiddleware);

// Onboarding procedures
export const createApplication = publicProcedure
  .input(createApplicationSchema)
  .output(
    z.object({
      message: z.string(),
      application: applicationSchema,
    }),
  )
  .handler(async ({ input }) => {
    // Check if application already exists
    const existing = await onboardingRepository.findByEmail(
      input.email.toLowerCase(),
    );

    if (existing) {
      throw new Error("An application with this email already exists");
    }

    const application = await onboardingRepository.createApplication({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      university: input.university,
      degreeProgram: input.degreeProgram,
      cvLink: input.cvLink,
    });

    return {
      message: "Application submitted successfully",
      application: {
        ...application,
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
      },
    };
  });

export const getApplicationById = publicProcedure
  .input(getApplicationByIdSchema)
  .output(applicationSchema)
  .handler(async ({ input }) => {
    const application = await onboardingRepository.getApplicationById(input.id);

    if (!application) {
      throw new Error("Application not found");
    }

    return {
      ...application,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };
  });

export const getApplicationByEmail = publicProcedure
  .input(getApplicationByEmailSchema)
  .output(applicationSchema)
  .handler(async ({ input }) => {
    const application = await onboardingRepository.findByEmail(
      input.email.toLowerCase(),
    );

    if (!application) {
      throw new Error("Application not found");
    }

    return {
      ...application,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };
  });

export const getApplicationsByStatus = publicProcedure
  .input(getApplicationsByStatusSchema)
  .output(z.array(applicationSchema))
  .handler(async ({ input }) => {
    const applications = await onboardingRepository.findByStatus(input.status);

    return applications.map((app) => ({
      ...app,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }));
  });

export const searchApplications = publicProcedure
  .input(searchApplicationsSchema)
  .output(z.array(applicationSchema))
  .handler(async ({ input }) => {
    const applications = await onboardingRepository.searchApplications(
      input.search,
    );

    return applications.map((app) => ({
      ...app,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }));
  });

export const getApplicationsByDateRange = publicProcedure
  .input(getApplicationsByDateRangeSchema)
  .output(z.array(applicationSchema))
  .handler(async ({ input }) => {
    const applications = await onboardingRepository.getApplicationsByDateRange(
      new Date(input.startDate),
      new Date(input.endDate),
    );

    return applications.map((app) => ({
      ...app,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }));
  });

export const getApplicationSummary = publicProcedure
  .output(
    z.object({
      counts: z.object({
        pending: z.number(),
        approved: z.number(),
        rejected: z.number(),
      }),
    }),
  )
  .handler(async () => {
    const counts = await onboardingRepository.getApplicationCountByStatus();
    return { counts };
  });

export const getAllApplications = publicProcedure
  .output(z.array(applicationSchema))
  .handler(async () => {
    const applications = await onboardingRepository.getAll({
      orderBy: { createdAt: "desc" },
    });

    // Also include students created directly (via invitation) who have no MenteeApplication
    const appEmails = new Set(applications.map((a: any) => a.email));
    const directStudents = await prisma.user.findMany({
      where: { role: Role.student, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const extraStudents = directStudents
      .filter((u) => !appEmails.has(u.email))
      .map((u) => ({
        id: u.id,
        fullName: `${u.firstName} ${u.lastName}`,
        email: u.email,
        university: "-",
        degreeProgram: "-",
        cvLink: "#",
        status: "approved" as const,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      }));

    const formattedApps = applications.map((app: any) => ({
      ...app,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }));

    return [...formattedApps, ...extraStudents];
  });

export const updateApplicationStatus = superAdminProcedure
  .input(updateApplicationStatusSchema)
  .output(
    z.object({
      message: z.string(),
      application: applicationSchema,
    }),
  )
  .handler(async ({ input }) => {
    const existing = await onboardingRepository.getApplicationById(input.id);

    if (!existing) {
      throw new Error("Application not found");
    }

    const application = await onboardingRepository.updateStatus(
      input.id,
      input.status,
    );

    return {
      message: "Application status updated successfully",
      application: {
        ...application,
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
      },
    };
  });
