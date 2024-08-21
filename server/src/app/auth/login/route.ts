import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const baseUrl = request.headers.get('origin');
    const formData = await request.formData();
    
    const username = formData.get('username');
    const password = formData.get('password');

    // authenticate user here and set authentication token in the cookie

    const headers = new Headers(request.headers);
    headers.set("Set-Cookie", "token=authenticated; Path=/; HttpOnly");
    
    return NextResponse.redirect(baseUrl!, { status: 303, headers: headers });
}