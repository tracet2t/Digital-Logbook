import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    const cookie = request.cookies.get("token");

    if (!cookie || !isValidToken(cookie.value)) {
        return NextResponse.redirect(`${process.env.BASE_URL}/login`);
    }
    return NextResponse.next();
}

const isValidToken = (token: string) => {
    try {
        // Verify the token using the JWT_SECRET from the environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return !!decoded;
    } catch (error) {
        return false;
    }
}

export const config = {
    matcher: [
        // Apply the middleware to all routes except those listed below
        '/((?!login|auth/login|_next/static|_next/image|favicon.ico|api/blogs).*)',
    ],
};
