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

    if (reqCookies) {
        const sessionCookie = reqCookies.get('token');
        payload = sessionCookie ? sessionCookie.value.split('.')[1] : null;
    } else {
        const sessionCookie = serverCookies().get('token');
        payload = sessionCookie ? sessionCookie.value.split('.')[1] : null;
    }

    const decodedPayload = payload ? JSON.parse(Buffer.from(payload, 'base64').toString()) : null;
    return new JwtPayloadSession(decodedPayload);
}
