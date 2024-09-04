import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt-ts";

export async function POST(request: Request) {
    const baseUrl = request.headers.get('origin');
    const formData = await request.formData();

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;

    if (!firstName || !lastName || !email) {
        return NextResponse.json({ error: "First name, last name, and email are required" }, { status: 400 });
    }

    const password = Math.random().toString(36).slice(-8); // Generate a random password
    const hashedPassword = await hash(password, 10);

    try {
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash: hashedPassword,
                role: 'student',
            },
        });

        

        return NextResponse.redirect(baseUrl!, { status: 303,  });
    
    } catch (error) {
        console.error("Error registering student:", error);
        return NextResponse.json({ error: "An error occurred during student registration" }, { status: 500 });
    }
}
