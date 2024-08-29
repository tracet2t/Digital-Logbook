import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    // Skip token validation for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    let cookie = request.cookies.get("token");
    if (!cookie || !isValidToken(cookie.value)) {
        return NextResponse.redirect(`${process.env.BASE_URL}/login`);
    }
    return NextResponse.next();
}

const isValidToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
        return !!decoded;
    } catch (error) {
        return false;
    }
}

export const config = {
    matcher: [
        '/((?!login|auth/login|_next/static|_next/image|favicon.ico).*)',
    ],
}
