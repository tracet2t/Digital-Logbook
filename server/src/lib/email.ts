// src/lib/email.ts
import nodemailer from "nodemailer";
import { EmailTemplate } from "@/components/EmailTemplate/EmailTemplate";

interface EmailData {
  email: string;
  password?: string;
  name: string;
  message?: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
});

export async function sendEmail({
  email,
  password,
  name,
  message,
}: EmailData): Promise<void> {
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Hello ${name}, here is your message!`,
    text: message || "",
    html: EmailTemplate({ name, password: password || "", loginUrl }),
  };

  await transporter.sendMail(mailOptions);
}

export async function sendInvitationEmail(
  email: string,
  invitationUrl: string,
): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You've been invited to Digital Logbook!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Invitation to Digital Logbook</h2>
        <p style="margin-bottom: 20px;">You have been invited to join the Digital Logbook platform.</p>
        <p style="margin-bottom: 20px;">To complete your registration and set up your account, please click the link below:</p>
        <p style="margin-bottom: 20px;">
          <a href="${invitationUrl}" style="background-color: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Join Now</a>
        </p>
        <p style="margin-bottom: 20px;">Or copy and paste this URL into your browser:</p>
        <p style="margin-bottom: 20px; color: #1a73e8;">${invitationUrl}</p>
        <p style="margin-bottom: 20px;">This invitation link will expire in 24 hours.</p>
        <p style="margin-bottom: 20px;">If you didn't expect this invitation, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
