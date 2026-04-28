"use server";

/* 
Credit for this entire method goes to B. Saranga
*/
import { Role } from "@/types";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

import { select } from "@/lib/extras";

class JwtPayloadSession {
  public payload: any;
  role: string | null;

  constructor(payload: string) {
    this.payload = payload;
  }

  isAuthenticated() {
    return !!this.payload && !!this.payload["email"] && !!this.payload["role"];
  }

  getUsername() {
    return this.isAuthenticated() ? this.payload["email"] : null;
  }

  getId() {
    return this.isAuthenticated() ? this.payload["id"] : null;
  }

  getRole(): Role | null {
    return this.isAuthenticated() ? this.payload["role"] : null;
  }

  getName() {
    return this.isAuthenticated()
      ? this.payload["fname"] + " " + this.payload["lname"]
      : null;
  }
}

export default async function getSession(
  reqCookies: RequestCookies | null = null,
): Promise<JwtPayloadSession> {
  const sessionCookie = !!reqCookies
    ? reqCookies.get("token")
    : cookies().get("token");
  const [_, payload, __] = sessionCookie
    ? sessionCookie!.value.split(".")
    : [null, null, null];
  return new JwtPayloadSession(!!payload ? JSON.parse(atob(payload)) : null);
}

/*
    This has to be used in client components because
    server action return types has to be serializable,
    and classes are not supported at the moment.
*/
async function getSessionOnClient(): Promise<any> {
  const sessionCookie = cookies().get("token");
  const [_, payload, __] = sessionCookie
    ? sessionCookie.value.split(".")
    : [null, null, null];
  return !!payload
    ? select(JSON.parse(atob(payload)), [
        "email",
        "id",
        "role",
        "fname",
        "lname",
      ])
    : null;
}

export { getSessionOnClient };
