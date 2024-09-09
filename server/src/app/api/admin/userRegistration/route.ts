import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { EmailTemplate } from "@/components/EmailTemplate/EmailTemplate";

const prisma = new PrismaClient();

export async function GET() {
  return new NextResponse("Hello Asky, this is a user registration API");
}

export async function POST(req: NextRequest) {
  const { email, firstName, lastName } = await req.json();

  if (!email || !firstName || !lastName) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "User already exists" },
      { status: 409 } // Conflict
    );
  }

  // Generate a random password
  const password = uuidv4().slice(0, 8);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: hashedPassword,
        role: "student",
      },
    });

    // login URL
    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;

    // logo URL
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.png`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Digital Logbook!",
      html: EmailTemplate({ firstName, password, loginUrl, logoUrl }),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Successfully created user and sent email",
      user: user,
    });
  } catch (error) {
    console.error("Error creating user or sending email:", error);
    return NextResponse.json(
      { success: false, message: "Error creating user or sending email" },
      { status: 500 }
    );
  }
}
