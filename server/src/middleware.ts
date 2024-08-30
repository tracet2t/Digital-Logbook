import { NextRequest, NextResponse } from 'next/server';
//import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
/*
    if (!token || !isValidToken(token)) {
        const loginUrl = new URL('/login', process.env.BASE_URL as string);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
*/}
/*
const isValidToken = (token: string): boolean => {
    try {
        // Verify the token using the JWT_SECRET from environment variables
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        jwt.verify(token, secret);
        return true;
    } catch (error) {
        console.error('Invalid token:', error);
        return false;
    }
}
*/
export const config = {
    matcher: [
        // Apply the middleware to all routes except those listed below
        '/((?!login|auth/login|_next/static|_next/image|favicon.ico|api/blogs).*)',
    ],
};
