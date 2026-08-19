import { resolveFunnelState } from "@/lib/auth/funnel-state";
import { verifyPassword } from "@/lib/auth/password";
import { setAuthCookie, signAuthToken } from "@/lib/auth/session";
import { findUserByLogin } from "@/lib/auth/users";
import { isMongoEnabled } from "@/lib/mongodb/client";
import { AUTH_RATE_LIMIT, checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { AuthUser } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  login: z.string().min(3),
  password: z.string().min(8),
});

function toAuthUser(row: NonNullable<Awaited<ReturnType<typeof findUserByLogin>>>): AuthUser {
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    locale: row.locale,
  };
}

export async function POST(request: Request) {
  if (!isMongoEnabled()) {
    return NextResponse.json(
      { error: "Database not configured. Set MONGODB_URI." },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(
    `auth:login:${ip}`,
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
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const user = await findUserByLogin(parsed.data.login);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const authUser = toAuthUser(user);
    const token = await signAuthToken({ sub: user.id, email: user.email });
    await setAuthCookie(token);

    const funnel = await resolveFunnelState(user.id, request);

    return NextResponse.json({
      user: authUser,
      redirectTo: funnel.redirectTo,
      intakeDone: funnel.intakeDone,
      paid: funnel.paid,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
