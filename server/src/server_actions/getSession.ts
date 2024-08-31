'use server'
import { select } from "@/lib/extras";
import { cookies } from "next/headers"
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { Role } from "@/types";

class JwtPayloadSession {
    #payload;
    constructor(payload: string) {
        this.#payload = payload;
    }

    isAuthenticated() {
        return !!this.#payload && !!(this.#payload as any)["user"] && !!(this.#payload as any)["role"];
    }

    getUsername() {
        return this.isAuthenticated() ? (this.#payload as any)["user"] : null;
    }

    getRole(): Role {
        return this.isAuthenticated() ? (this.#payload as any)["role"] : null;
    }
}

export default async function getSession(reqCookies: RequestCookies | null = null): Promise<JwtPayloadSession> {
    const sessionCookie = !!reqCookies ? reqCookies.get('token') : cookies().get('token');
    const [_, payload, __] = sessionCookie ? sessionCookie!.value.split('.') : [null, null, null];
    return new JwtPayloadSession(!!payload ? JSON.parse(atob(payload)) : null);
}

/*
    This has to be used in client components because
    server action return types has to be serializable,
    and classes are not supp    orted at the moment.
*/
async function getSessionOnClient(): Promise<any> {
    const sessionCookie = cookies().get('token');
    const [_, payload, __] = sessionCookie ? sessionCookie.value.split('.') : [null, null, null];
    return !!payload ? select(JSON.parse(atob(payload)), ['user', 'role']) : null;
}

export { getSessionOnClient }