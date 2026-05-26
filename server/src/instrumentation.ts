export async function register() {
  // Conditionally import if facing runtime compatibility issues
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  await import("@/lib/orpc.server");
  // Workers now run in a separate container — see src/worker/index.ts
  // }
}
