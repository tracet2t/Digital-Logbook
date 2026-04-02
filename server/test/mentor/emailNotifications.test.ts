import nodemailer from "nodemailer";
import { sendEmail } from "../../src/lib/email";

jest.mock("../../src/components/EmailTemplate/EmailTemplate", () => ({
  __esModule: true,
  EmailTemplate: jest.fn(() => "<div>Mock Email Template</div>"),
}));

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(),
  },
}));

describe("sendActivitySubmissionNotification", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      EMAIL_USER: "sender@test.com",
      EMAIL_PASS: "secret-pass",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("should send registration email", async () => {
    const sendMailMock = jest.fn().mockResolvedValue({});
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    await sendEmail({
      email: "student@test.com",
      name: "Alice",
      message: "Welcome",
      tempPassword: "Temp@123",
      loginUrl: "https://example.com/login",
      token: "abc-token",
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: "sender@test.com",
        pass: "secret-pass",
      },
    });

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "sender@test.com",
        to: "student@test.com",
        subject: "Hello!! Here is your link to Registration",
        text: "Welcome",
        html: "<div>Mock Email Template</div>",
      }),
    );
  });

  test("should throw when sendMail fails", async () => {
    const sendError = new Error("SMTP failure");
    const sendMailMock = jest.fn().mockRejectedValue(sendError);

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    await expect(
      sendEmail({
        email: "student@test.com",
        name: "Bob",
        message: "Welcome",
        tempPassword: "Temp@123",
        loginUrl: "https://example.com/login",
        token: "abc-token",
      }),
    ).rejects.toThrow("SMTP failure");
  });
});
