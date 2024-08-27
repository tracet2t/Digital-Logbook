import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    console.log("Middleware called");

    // verify authentication cookie here (JWT or any other method)
    
    // let cookie = request.cookies.get("token");
    // if (!cookie || cookie.value != 'authenticated') {
    //     return NextResponse.redirect(`${process.env.BASE_URL}/login`);
    // }
    return NextResponse.next();
}

export const config = {
    matcher: [
      '/((?!login|auth/login|_next/static|_next/image|favicon.ico).*)',
    ],
  }