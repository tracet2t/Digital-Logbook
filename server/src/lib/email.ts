// src/lib/email.ts
import nodemailer from "nodemailer";
import { EmailTemplate } from "@/components/EmailTemplate/EmailTemplate";

interface EmailData {
  email: string;
   name: string;
  message: string;
  tempPassword: string;
  loginUrl: string;
  token: string;
}

export async function sendEmail({ email, tempPassword, name, message, loginUrl, token }: EmailData): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Hello!! Here is your link to Registration`,
    text: message,
    html: EmailTemplate({ name,tempPassword, loginUrl }),
  };

  await transporter.sendMail(mailOptions);
}