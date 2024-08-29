import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware called');

  const token = request.cookies.get('token');
  const userRole = 'student'; 
  


  if (!token || token.value !== 'authenticated') {
    return NextResponse.redirect(`${process.env.BASE_URL}/login`);
  }

  const { pathname } = request.nextUrl;

  if (userRole === 'student') {
    if (pathname.startsWith('/mentor')) {
      return NextResponse.redirect(`${process.env.BASE_URL}/unauthorized`);
    }
    if (pathname === '/unauthorized') {
      return NextResponse.next();
    }
    // if (pathname !== '/student') {
    //   return NextResponse.redirect(`${process.env.BASE_URL}/student`);
    // }
  }

  if (userRole === 'mentor') {
    if (pathname.startsWith('/student')) {
      return NextResponse.redirect(`${process.env.BASE_URL}/unauthorized`);
    }
    if (pathname === '/unauthorized') {
      return NextResponse.redirect(`${process.env.BASE_URL}/mentor`);
    }
    // if (pathname !== '/mentor') {
    //   return NextResponse.redirect(`${process.env.BASE_URL}/mentor`);
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!login|auth/login|_next/static|_next/image|favicon.ico).*)',
  ],
};
