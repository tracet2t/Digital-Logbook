import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const baseUrl = request.headers.get('origin');
    const headers = new Headers(request.headers);
    const response = NextResponse.redirect(baseUrl!, { status: 303, headers: headers });
    
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
}