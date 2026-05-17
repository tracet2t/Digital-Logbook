import { OnboardingRepository } from "@/repositories/onboarding_repository_impl";
import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const onboardingRepository = new OnboardingRepository();

const allowedStatuses = ["pending", "approved", "rejected"] as const;
type AllowedStatus = (typeof allowedStatuses)[number];

function isAllowedStatus(value: string): value is AllowedStatus {
  return (allowedStatuses as readonly string[]).includes(value);
}

function isValidDateString(value: string) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = String(body?.fullName ?? "").trim();
    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();
    const university = String(body?.university ?? "").trim();
    const degreeProgram = String(body?.degreeProgram ?? "").trim();
    const cvLink = String(body?.cvLink ?? "").trim();

    if (!fullName || !email || !university || !degreeProgram || !cvLink) {
      return NextResponse.json(
        {
          message:
            "fullName, email, university, degreeProgram, and cvLink are required",
        },
        { status: 400 },
      );
    }

    const existing = await onboardingRepository.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { message: "An application with this email already exists" },
        { status: 409 },
      );
    }

    const application = await onboardingRepository.createApplication({
      fullName,
      email,
      university,
      degreeProgram,
      cvLink,
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating onboarding application:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const summary = searchParams.get("summary");

    if (summary === "true") {
      const counts = await onboardingRepository.getApplicationCountByStatus();
      return NextResponse.json({ counts }, { status: 200 });
    }

    if (id) {
      const application = await onboardingRepository.getApplicationById(id);
      if (!application) {
        return NextResponse.json(
          { message: "Application not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(application, { status: 200 });
    }

    if (email) {
      const application = await onboardingRepository.findByEmail(
        email.trim().toLowerCase(),
      );
      if (!application) {
        return NextResponse.json(
          { message: "Application not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(application, { status: 200 });
    }

    if (status) {
      if (!isAllowedStatus(status)) {
        return NextResponse.json(
          { message: "Invalid status. Use pending, approved, or rejected" },
          { status: 400 },
        );
      }
      const applications = await onboardingRepository.findByStatus(status);
      return NextResponse.json(applications, { status: 200 });
    }

    if (search) {
      const applications = await onboardingRepository.searchApplications(
        search.trim(),
      );
      return NextResponse.json(applications, { status: 200 });
    }

    if (startDate || endDate) {
      if (!startDate || !endDate) {
        return NextResponse.json(
          { message: "Both startDate and endDate are required" },
          { status: 400 },
        );
      }

      if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
        return NextResponse.json(
          { message: "Invalid date format for startDate or endDate" },
          { status: 400 },
        );
      }

      const applications =
        await onboardingRepository.getApplicationsByDateRange(
          new Date(startDate),
          new Date(endDate),
        );
      return NextResponse.json(applications, { status: 200 });
    }

    const applications = await onboardingRepository.getAll({
      orderBy: { createdAt: "desc" },
    });

    const appEmailList = (applications as { email: string }[]).map(
      (a) => a.email,
    );
    const applicationUsers = await prisma.user.findMany({
      where: { email: { in: appEmailList } },
      select: { email: true, isActive: true },
    });
    const userActiveByEmail = applicationUsers.reduce(
      (acc, user) => {
        acc[user.email] = user.isActive;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    const mappedApplications = applications.map((app) => {
      const isActive = userActiveByEmail[app.email];
      if (isActive === false) {
        return { ...app, status: "inactive" };
      }
      return app;
    });

    // Also include students created directly (via invitation) who have no MenteeApplication
    const appEmails = new Set(
      (mappedApplications as { email: string }[]).map((a) => a.email),
    );
    const directStudents = await prisma.user.findMany({
      where: { role: Role.student },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
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
        status: (u.isActive ? "approved" : "inactive") as const,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      }));

    return NextResponse.json([...mappedApplications, ...extraStudents], {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching onboarding applications:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const id = String(body?.id ?? "").trim();
    const status = String(body?.status ?? "")
      .trim()
      .toLowerCase();

    if (!id || !status) {
      return NextResponse.json(
        { message: "id and status are required" },
        { status: 400 },
      );
    }
    if (!isAllowedStatus(status)) {
      return NextResponse.json(
        { message: "Invalid status. Use pending, approved, or rejected" },
        { status: 400 },
      );
    }
    const existing = await onboardingRepository.getApplicationById(id);
    if (!existing) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 },
      );
    }

    const application = await onboardingRepository.updateStatus(id, status);
    return NextResponse.json(
      { message: "Application status updated successfully", application },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating onboarding application:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
