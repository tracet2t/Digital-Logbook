import getSession from "@/server_actions/getSession";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/mentee/profile/share
 * @returns {Object} { success, data: { token, shareUrl, isActive, createdAt } }
 */
export async function POST(req: NextRequest) {
  try {
    // ─── AUTHENTICATION ────────────────────────────────────
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    // ─── AUTHORIZATION ─────────────────────────────────────
    if (session.getRole() !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden - Only students can share profiles",
        },
        { status: 403 },
      );
    }

    const studentId = session.getId();
    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "User ID not found in session" },
        { status: 401 },
      );
    }

    // ─── PARSE REGENERATE FLAG ─────────────────────────────
    const body = await req.json().catch(() => ({}));
    const shouldRegenerate = body.regenerate === true;

    // ─── UPSERT SHARE TOKEN ────────────────────────────────
    const shared = shouldRegenerate
      ? await prisma.sharedProfile.upsert({
          where: { studentId },
          update: {
            token: crypto.randomUUID(),
            isActive: true,
            expiresAt: null,
          },
          create: {
            studentId,
            token: crypto.randomUUID(),
            isActive: true,
          },
        })
      : await prisma.sharedProfile.upsert({
          where: { studentId },
          update: { isActive: true }, // reactivate existing token
          create: {
            studentId,
            token: crypto.randomUUID(),
            isActive: true,
          },
        });

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shared-profile/${shared.token}`;

    return NextResponse.json({
      success: true,
      data: {
        token: shared.token,
        shareUrl,
        isActive: shared.isActive,
        createdAt: shared.createdAt,
      },
    });
  } catch (error) {
    console.error("Error generating share link:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/mentee/profile/share
 *
 * Returns the current share link for the authenticated mentee, or null if
 * none has been created yet.
 *
 * Authentication: Required (student role)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    if (session.getRole() !== "student") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const studentId = session.getId();
    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 401 },
      );
    }

    const shared = await prisma.sharedProfile.findUnique({
      where: { studentId },
    });

    if (!shared) {
      return NextResponse.json({ success: true, data: null });
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shared-profile/${shared.token}`;

    return NextResponse.json({
      success: true,
      data: {
        token: shared.token,
        shareUrl,
        isActive: shared.isActive,
        createdAt: shared.createdAt,
        expiresAt: shared.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error fetching share link:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/mentee/profile/share
 *
 * Deactivates the current share link so it can no longer be accessed.
 *
 * Authentication: Required (student role)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    if (session.getRole() !== "student") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const studentId = session.getId();
    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 401 },
      );
    }

    await prisma.sharedProfile.update({
      where: { studentId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Share link deactivated",
    });
  } catch (error) {
    console.error("Error deactivating share link:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
