export async function register() {
  // Conditionally import if facing runtime compatibility issues
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  await import("@/lib/orpc.server");
  await import("@/lib/onboardingQueue"); // initializes the BullMQ worker on startup
  // }
}
