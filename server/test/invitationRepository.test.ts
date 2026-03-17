import { InvitationRepository } from "../src/repositories/invitation_repository_impl";
import prisma from "../src/lib/prisma";
import { Role } from "@prisma/client";
import crypto from "crypto";

jest.mock("../src/lib/prisma", () => ({
  __esModule: true,
  default: {
    invitation: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("InvitationRepository", () => {
  const repo = new InvitationRepository();

  test("should create an invitation successfully", async () => {
    jest.spyOn(crypto, "randomBytes").mockImplementation((size: number) => {
      // ignore size, always return same buffer for test
      return Buffer.from("mocktokenmocktokenmocktokenmocktoken");
    });

    const mockData = {
      email: "student@test.com",
      role: Role.student,
      invitedBy: "admin-id-123",
      tempPassword: "hashedpassword",
    };

    (prisma.invitation.create as jest.Mock).mockResolvedValue({
      id: "invite-id",
      email: mockData.email,
      role: mockData.role,
      accepted: false,
    });

    const result = await repo.createInvite(mockData);

    expect(prisma.invitation.create).toHaveBeenCalledTimes(1);

    expect(prisma.invitation.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: mockData.email,
        role: mockData.role,
        accepted: false,
        tempPassword: mockData.tempPassword,
        inviter: {
          connect: { id: mockData.invitedBy },
        },
      }),
    });

    expect(result.email).toBe("student@test.com");
  });

  /*
    TEST: createInvite failure
  */
  test("should throw error if invitedBy is missing", async () => {
    const invalidData: any = {
      email: "student@test.com",
      role: Role.student,
      tempPassword: "hashedpassword",
    };

    await expect(repo.createInvite(invalidData)).rejects.toThrow(
      "invitedBy (super-admin ID) is required",
    );
  });

  /*
    TEST: findValidInvite
  */
  test("should return valid invitation", async () => {
    const mockInvite = {
      id: "invite-id",
      email: "student@test.com",
      token: "valid-token",
      accepted: false,
    };

    (prisma.invitation.findFirst as jest.Mock).mockResolvedValue(mockInvite);

    const result = await repo.findValidInvite(
      "student@test.com",
      "valid-token",
    );

    expect(prisma.invitation.findFirst).toHaveBeenCalledWith({
      where: {
        email: "student@test.com",
        token: "valid-token",
        accepted: false,
        expiresAt: { gte: expect.any(Date) },
      },
    });

    expect(result).toEqual(mockInvite);
  });

  /*
    TEST: markAccepted
  */
  test("should mark invitation as accepted", async () => {
    const updatedInvite = {
      id: "invite-id",
      accepted: true,
    };

    (prisma.invitation.update as jest.Mock).mockResolvedValue(updatedInvite);

    const result = await repo.markAccepted("invite-id");

    expect(prisma.invitation.update).toHaveBeenCalledWith({
      where: { id: "invite-id" },
      data: { accepted: true },
    });

    expect(result.accepted).toBe(true);
  });

  test("should generate a secure token when creating invitation", async () => {
    // Arrange: spy on crypto.randomBytes
    const randomBytesSpy = jest
      .spyOn(crypto, "randomBytes")
      .mockImplementation((size: number) => {
        expect(size).toBe(32); // verify size
        return Buffer.from("12345678901234567890123456789012"); // 32 bytes string
      });

    const mockData: Parameters<InvitationRepository["createInvite"]>[0] = {
      email: "student@test.com",
      role: Role.student,
      invitedBy: "admin-id-123",
      tempPassword: "hashedpassword",
    };

    // Mock prisma.create to just return what we pass in
    (prisma.invitation.create as jest.Mock).mockImplementation(
      async (args) => ({
        ...args.data,
        id: "invite-id",
      }),
    );

    // Act
    const result = await repo.createInvite(mockData);

    // Assert
    expect(randomBytesSpy).toHaveBeenCalled();
    expect(result.token).toBe(
      Buffer.from("12345678901234567890123456789012").toString("hex"),
    ); // matches spy output
  });

  test("should issue a valid secure token with correct format", async () => {
    const mockData: Parameters<InvitationRepository["createInvite"]>[0] = {
      email: "student@test.com",
      role: Role.student,
      invitedBy: "admin-id-123",
      tempPassword: "hashedpassword",
    };

    let capturedToken = "";

    // Mock crypto.randomBytes to actually generate a "random" token
    jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
      const buf = Buffer.alloc(size, "a"); // 32 bytes of 'a' for test
      capturedToken = buf.toString("hex");
      return buf;
    });

    // Mock prisma.create to capture data
    (prisma.invitation.create as jest.Mock).mockImplementation(async (args) => {
      return { ...args.data, id: "invite-id" };
    });

    const result = await repo.createInvite(mockData);

    // Check that the token returned is exactly what crypto generated
    expect(result.token).toBe(capturedToken);

    // Check token length (32 bytes → 64 hex chars)
    expect(result.token.length).toBe(64);

    // Check token only contains hex characters
    expect(result.token).toMatch(/^[0-9a-f]+$/);
  });

  //Token Uniqueness
  test("should generate unique tokens for multiple invitations", async () => {
    const tokens: string[] = [];
    let counter = 0;

    jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
      counter++;
      const buf = Buffer.from("token" + counter + "0000000000000000000000"); // 32 bytes
      return buf;
    });

    (prisma.invitation.create as jest.Mock).mockImplementation(
      async (args) => ({
        ...args.data,
        id: `invite-id-${counter}`,
      }),
    );

    const first = await repo.createInvite({
      email: "user1@test.com",
      role: Role.student,
      invitedBy: "admin-id",
      tempPassword: "pwd1",
    });
    tokens.push(first.token);

    const second = await repo.createInvite({
      email: "user2@test.com",
      role: Role.student,
      invitedBy: "admin-id",
      tempPassword: "pwd2",
    });
    tokens.push(second.token);

    expect(tokens[0]).not.toBe(tokens[1]);
  });

  //Token Expiration rejection test
  test("should reject expired invitations", async () => {
    const expiredInvite = {
      id: "expired-id",
      email: "expired@test.com",
      token: "expired-token",
      accepted: false,
      expiresAt: new Date(Date.now() - 1000 * 60), // past
    };

    (prisma.invitation.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await repo.findValidInvite(
      "expired@test.com",
      "expired-token",
    );

    expect(prisma.invitation.findFirst).toHaveBeenCalledWith({
      where: {
        email: "expired@test.com",
        token: "expired-token",
        accepted: false,
        expiresAt: { gte: expect.any(Date) },
      },
    });

    expect(result).toBeNull();
  });
});
