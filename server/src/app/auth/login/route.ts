import { NextResponse } from "next/server";
import { compare } from "bcrypt-ts";
import * as jose from 'jose';
import { UserRepository } from '@/repositories/repositories';  // Import the repository
export async function POST(request: Request) {
    const baseUrl = request.headers.get('origin');
    const formData = await request.formData();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    try {
        const userRepository = new UserRepository();
        const user = await userRepository.getByEmail(email);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const algo = 'HS256';

        const token = await new jose.SignJWT({
            id: user.id,
            email: user.email,
            role: user.role.toString(),
            fname: user.firstName,
            lname: user.lastName
        })
            .setProtectedHeader({ alg: algo })
            .setIssuedAt()
            .setIssuer(process.env.ISSUER!)
            .setAudience(process.env.AUDIENCE!)
            .setExpirationTime(process.env.JWT_EXPIRY!)
            .sign(secret);


        let redirectUrl = `${baseUrl}/unauthorized`;
        if (user.role === 'student') {
            redirectUrl = !user.emailConfirmed ? `${baseUrl}/reset-password` : `${baseUrl}/student`;
        } else if (user.role === 'mentor') {
            redirectUrl = `${baseUrl}/mentor`;
        }

        const response =  NextResponse.json({
            message: "Login successful",
            redirectUrl: redirectUrl,
        });
        response.headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly`);
        return response;

    } catch (error) {
        console.error("Error during authentication", error);
        return NextResponse.json({ error: "An error occurred during authentication" }, { status: 500 });
    }
}