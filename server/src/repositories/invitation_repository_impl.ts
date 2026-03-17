import prisma from "@/lib/prisma";
import {
  Invitation,
  Role,
} from "@prisma/client";
import BaseRepository from "./baseRepository";
import crypto from "crypto"

export class InvitationRepository extends BaseRepository<Invitation> {
  constructor() {
    super(prisma.invitation);
  }

  async createInvite(data: {
    email: string;
    role: Role;
    invitedBy: string; // ID of the super-admin
    tempPassword: string; // hashed
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
        tempPassword: data.tempPassword,
        inviter: {
          connect: { id: data.invitedBy }, // ✅ Connect the relation properly
        },
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