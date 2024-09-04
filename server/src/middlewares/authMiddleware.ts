import * as jose from 'jose';
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

export function withAuthMiddleware(middleware: NextMiddleware): NextMiddleware {
    return async (request: NextRequest, event: NextFetchEvent) => {
        
        let token = request.cookies.get("token");
    
        if (!token) {
            return NextResponse.redirect(`${process.env.BASE_URL}/login`);
        }
        
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            const {payload, protectedHeader} = await jose.jwtVerify(token.value, secret);

        } catch (error) {
        
            console.error(error);
            
            const headers = new Headers(request.headers);

            if ((error as any).code == "ERR_JWT_EXPIRED") {
                headers.set("Set-Cookie", "redirect_error=Session expired. Please login again.; Path=/login;");
            }

            headers.set("Set-Cookie", "redirect_error=An error occurred while logging you in.; Path=/login;");  
            headers.append("Set-Cookie", `token=${token}; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/; HttpOnly`);
            return NextResponse.redirect(`${process.env.BASE_URL}/login`, { status: 303, headers: headers });
        }

        return middleware(request, event);
    }
}