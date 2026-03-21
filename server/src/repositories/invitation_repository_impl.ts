import crypto from "crypto";

import { Invitation, Role } from "@prisma/client";

import prisma from "@/lib/prisma";

import BaseRepository from "./baseRepository";

export class InvitationRepository extends BaseRepository<Invitation> {
  constructor() {
    super(prisma.invitation);
  }

  async createInvite(data: {
    email: string;
    role: Role;
    invitedBy: string; // ID of the super-admin
    projectId: string; // Project ID
  }) {
    const token = crypto.randomBytes(32).toString("hex"); // secure token
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours

    //to make sure invitedBy is not null
    if (!data.invitedBy)
      throw new Error("invitedBy (super-admin ID) is required");

    return this.modelClient.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        expiresAt,
        accepted: false,
        invitedBy: data.invitedBy,
        projectId: data.projectId,
      },
    });
  }

  async findValidInvite(email: string, token: string) {
    return this.modelClient.findFirst({
      where: {
        email,
        token,
        accepted: false,
        expiresAt: { gte: new Date() },
      },
    });
  }

  async markAccepted(id: string) {
    return this.modelClient.update({
      where: { id },
      data: { accepted: true },
    });
  }
}
