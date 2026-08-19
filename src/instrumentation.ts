import { assertProductionEnv, warnWeakDevSecrets } from "@/lib/env";

/**
 * Runs when the Next.js server starts. Avoid throwing here on `next build`
 * (NODE_ENV=production during build) unless env is guaranteed present.
 */
export async function register() {
  warnWeakDevSecrets();
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    assertProductionEnv();
  }
}
