import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        batchNo: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id, isActive } = (await request.json()) as {
      id: string;
      isActive: boolean;
    };
    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 },
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, isActive: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing user id" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // Delete feedback for this user's activities
      const activities = await tx.activity.findMany({
        where: { studentId: id },
        select: { id: true },
      });
      const activityIds = activities.map((a) => a.id);
      await tx.mentorFeedback.deleteMany({
        where: { activityId: { in: activityIds } },
      });
      await tx.activity.deleteMany({ where: { studentId: id } });

      // Delete feedback this user gave as mentor
      await tx.mentorFeedback.deleteMany({ where: { mentorId: id } });
      await tx.mentorActivity.deleteMany({ where: { mentorId: id } });

      // Delete reports, badges, allocations
      await tx.report.deleteMany({ where: { mentorId: id } });
      await tx.userBadge.deleteMany({ where: { userId: id } });
      await tx.projectAllocation.deleteMany({ where: { studentId: id } });
      await tx.projectMentor.deleteMany({ where: { mentorId: id } });

      // Null-out invitations sent by this user, then delete their own invitation
      await tx.invitation.updateMany({
        where: { invitedBy: id },
        data: { invitedBy: null },
      });
      await tx.invitation.deleteMany({
        where: {
          email:
            (
              await tx.user.findUnique({
                where: { id },
                select: { email: true },
              })
            )?.email ?? "",
        },
      });

      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
