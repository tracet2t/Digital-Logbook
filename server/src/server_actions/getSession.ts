'use server'
/* 
Credit for this entire method goes to B. Saranga
*/
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
        return !!this.#payload && !!(this.#payload as any)["email"] && !!(this.#payload as any)["role"];
    }

    getUsername() {
        return this.isAuthenticated() ? (this.#payload as any)["email"] : null;
    }

    getId() {
        return this.isAuthenticated() ? (this.#payload as any)['id'] : null;
    }

    getRole(): Role {
        console.log(this.#payload as any);
        console.log(!!this.#payload && !!(this.#payload as any)["email"] && !!(this.#payload as any)["role"]);
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
    and classes are not supported at the moment.

*/
async function getSessionOnClient(): Promise<any> {
    const sessionCookie = cookies().get('token');
    const [_, payload, __] = sessionCookie ? sessionCookie.value.split('.') : [null, null, null];
    return !!payload ? select(JSON.parse(atob(payload)), ['email', 'id', 'role']) : null;
}

export { getSessionOnClient }