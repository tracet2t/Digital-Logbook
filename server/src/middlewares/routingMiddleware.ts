import { isUrlAllowed } from "@/lib/extras";
import getSession from "@/server_actions/getSession";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

const mentorRoutingBlacklist = ['/admin'];
const studentRoutingBlacklist = [...mentorRoutingBlacklist,'/mentor'];

export function withRoleBasedRoutingMiddleware(middleware: NextMiddleware): NextMiddleware {
    return async (request: NextRequest, event: NextFetchEvent) => {

        const session = (await getSession(request.cookies));

        const role = session.getRole();

        if (role === 'student' && !isUrlAllowed(request.nextUrl.pathname, studentRoutingBlacklist)) {
            return NextResponse.redirect(`${process.env.BASE_URL}/unauthorized`);
        }

        if (role === 'mentor' && !isUrlAllowed(request.nextUrl.pathname, mentorRoutingBlacklist)) {
            return NextResponse.redirect(`${process.env.BASE_URL}/unauthorized`);
        }

        return middleware(request, event);
    }
}