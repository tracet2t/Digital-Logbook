import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt-ts";
import * as jose from 'jose';

export async function POST(request: Request) {
    const baseUrl = request.headers.get('origin');
    const formData = await request.formData();
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
 
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const algo = 'HS256';
        
        // Add the user's `id` to the JWT payload
        const token = await new jose.SignJWT({ id: user.id, email: user.email, role: user.role.toString() })
            .setProtectedHeader({ alg: algo })
            .setIssuedAt()
            .setIssuer(process.env.ISSUER!)
            .setAudience(process.env.AUDIENCE!)
            .setExpirationTime(process.env.JWT_EXPIRY!)
            .sign(secret);
        
        const headers = new Headers(request.headers);
        headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly`);
        
        return NextResponse.redirect(baseUrl!, { status: 303, headers: headers });
    
    } catch (error) {
        console.error("Error during authentication", error);
        return NextResponse.json({ error: "An error occurred during authentication" }, { status: 500 });
    }
}