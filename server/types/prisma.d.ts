// Provide minimal types for the `prisma` config helper until proper types are available.
// The Prisma package doesn't ship a declaration for this import path, so TS falls back
to `any` by default.

declare module "prisma" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function defineConfig(cfg: any): any;
}
