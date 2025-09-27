import { isUrlAllowed } from "@/lib/extras";
import getSession from "@/server_actions/getSession";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

const mentorRoutingBlacklist = ['/admin', '/student'];
const studentRoutingBlacklist = ['/admin','/mentor','/mentor/bulkreport'];

export function withRoleBasedRoutingMiddleware(middleware: NextMiddleware): NextMiddleware {
    return async (request: NextRequest, event: NextFetchEvent) => {

        const session = (await getSession(request.cookies));

        const role = session.getRole();

        const emailConfirmed = session.getEmailConfirmed();

        if (role === 'student' && !isUrlAllowed(request.nextUrl.pathname, studentRoutingBlacklist)) {
            return NextResponse.redirect(`${process.env.BASE_URL}/unauthorized`);
        }
        
        if (role === 'student' && request.nextUrl.pathname === '/'){
            return NextResponse.redirect(`${process.env.BASE_URL}/student`);
        }

        if (role === 'student' && request.nextUrl.pathname === '/student' && !emailConfirmed){
            return NextResponse.redirect(`${process.env.BASE_URL}/reset-password`);
        }

        if (role === 'mentor' && request.nextUrl.pathname === '/'){
            return NextResponse.redirect(`${process.env.BASE_URL}/mentor`);
        }

        if (role === 'mentor' && !isUrlAllowed(request.nextUrl.pathname, mentorRoutingBlacklist)) {
            return NextResponse.redirect(`${process.env.BASE_URL}/unauthorized`);
        }

        return middleware(request, event);
    }
}