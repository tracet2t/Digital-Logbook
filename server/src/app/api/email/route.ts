// src/api/email.route.tsx



import { EmailTemplate } from "@/components/EmailTemplate/EmailTemplate";
import nodemailer from "nodemailer";

interface EmailData {
  email: string;
  password: string;
  name: string;
  message: string;
}

export async function sendEmail({ email, password, name, message }: EmailData): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Hello ${name}, here is your message!`,
    text: message,
    html:EmailTemplate({ name, password, loginUrl }),
  };

  await transporter.sendMail(mailOptions);
}
