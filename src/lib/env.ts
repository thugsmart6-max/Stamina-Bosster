/**
 * Production env validation — called from instrumentation on server startup.
 */

const MIN_AUTH_SECRET_LEN = 32;

export function assertProductionEnv(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret || secret.length < MIN_AUTH_SECRET_LEN) {
    throw new Error(
      `[env] AUTH_SECRET must be at least ${MIN_AUTH_SECRET_LEN} characters in production.`
    );
  }

  if (!process.env.MONGODB_URI?.trim()) {
    throw new Error("[env] MONGODB_URI is required in production.");
  }
}

/** Dev-only hint — does not throw */
export function warnWeakDevSecrets(): void {
  if (process.env.NODE_ENV === "production") return;
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret || secret.length < MIN_AUTH_SECRET_LEN) {
    console.warn(
      `[vitalitypath] AUTH_SECRET is missing or shorter than ${MIN_AUTH_SECRET_LEN} chars — use a long random string before production.`
    );
  }
}
