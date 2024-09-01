// utils/getSession.ts
import { cookies as serverCookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { Role } from "@/types";

class JwtPayloadSession {
    #payload: any;

    constructor(payload: any) {
        this.#payload = payload;
    }

    isAuthenticated() {
        return !!this.#payload && !!this.#payload.email && !!this.#payload.role;
    }

    getUsername() {
        return this.isAuthenticated() ? this.#payload.email : null;
    }

    getRole(): Role | null {
        return this.isAuthenticated() ? this.#payload.role : null;
    }

    getUserId(): string | null {
        return this.isAuthenticated() ? this.#payload.id : null;
    }
}

export async function getSession(reqCookies: RequestCookies | null = null): Promise<JwtPayloadSession> {
    let payload: string | null = null;

    if (typeof window === "undefined") {
        const sessionCookie = reqCookies ? reqCookies.get('token') : serverCookies().get('token');
        payload = sessionCookie ? sessionCookie.value.split('.')[1] : null;
    } else {
        const cookies = document.cookie.split(';').find(c => c.trim().startsWith('token='));
        const sessionCookie = cookies ? cookies.split('=')[1] : null;
        payload = sessionCookie ? sessionCookie.split('.')[1] : null;
    }

    const decodedPayload = payload ? JSON.parse(atob(payload)) : null;
    return new JwtPayloadSession(decodedPayload);
}
