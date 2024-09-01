import { NextMiddleware, NextResponse } from "next/server";

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

export function chain(middlewareFunctions: MiddlewareFactory[], index = 0): NextMiddleware {
    const current = middlewareFunctions[index];

    if (current) {
        const next = chain(middlewareFunctions, index + 1);
        return current(next);
    }

    return () => NextResponse.next();
}