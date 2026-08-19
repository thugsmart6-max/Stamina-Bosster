import { hashPassword } from "@/lib/auth/password";
import { setAuthCookie, signAuthToken } from "@/lib/auth/session";
import { createUser, findUserByEmail, ensureUserIndexes } from "@/lib/auth/users";
import { getEmailFormatError, normalizeEmail } from "@/lib/email-format";
import { isMongoEnabled, isMongoConnectivityError } from "@/lib/mongodb/client";
import { AUTH_RATE_LIMIT, checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { locales, type Locale } from "@/i18n/routing";
import type { AuthUser } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

function isDuplicateKeyError(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: number }).code === 11000;
}

const signupSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().min(3).max(254),
  password: z.string().min(8).max(128),
  locale: z.enum(locales).optional(),
});

export async function POST(request: Request) {
  if (!isMongoEnabled()) {
    return NextResponse.json(
      { error: "Database not configured. Set MONGODB_URI." },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(
    `auth:signup:${ip}`,
    AUTH_RATE_LIMIT.max,
    AUTH_RATE_LIMIT.windowMs
  );
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      }
    );
  }

  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  try {
    await ensureUserIndexes();

    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid signup data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const formatError = getEmailFormatError(email);
    if (formatError) {
      return NextResponse.json({ error: formatError }, { status: 400 });
    }

    if (await findUserByEmail(email)) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await createUser({
      fullName: parsed.data.fullName,
      email,
      passwordHash,
      locale: (parsed.data.locale as Locale) ?? "en",
    });

    const authUser: AuthUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      locale: user.locale,
    };

    const token = await signAuthToken({ sub: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({ user: authUser });
  } catch (e) {
    console.error(e);

    if (isMongoConnectivityError(e)) {
      return NextResponse.json(
        {
          error:
            "Cannot reach the database. Check MONGODB_URI (Atlas SRV DNS), Network Access, and that the cluster hostname resolves.",
        },
        { status: 503 }
      );
    }
    if (isDuplicateKeyError(e)) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
