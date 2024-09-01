'use server'

import { redirect, RedirectType } from "next/navigation";
import getSession from "./getSession";

async function RedirectIfAuthenticated() {
    if ((await getSession()).isAuthenticated()) {
        redirect('/', RedirectType.replace)
    }
}

export { RedirectIfAuthenticated }