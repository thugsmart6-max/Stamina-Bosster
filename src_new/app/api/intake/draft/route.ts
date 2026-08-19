import { requireVerifiedAuth } from "@/lib/auth/guards";
import { locales, type Locale } from "@/i18n/routing";
import {
  checkRateLimit,
  getClientIp,
  INTAKE_DRAFT_RATE_LIMIT,
} from "@/lib/rate-limit";
import { getIntakeDraft, upsertIntakeDraft } from "@/lib/session-store";
import { isMongoEnabled } from "@/lib/mongodb/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const MAX_DRAFT_JSON = 48_000;

const patchSchema = z.object({
  intake: z.record(z.string(), z.unknown()),
  step: z.number().int().min(0).max(4),
  locale: z.enum(locales).optional(),
});

function requireJsonContentType(request: Request): NextResponse | null {
  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }
  return null;
}

export async function GET(request: Request) {
  if (!isMongoEnabled()) {
    return NextResponse.json({ draft: null }, { status: 200 });
  }

  const auth = await requireVerifiedAuth(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(
    `intake:draft:get:${ip}`,
    INTAKE_DRAFT_RATE_LIMIT.max,
    INTAKE_DRAFT_RATE_LIMIT.windowMs
  );
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      }
    );
  }

  const draft = await getIntakeDraft(auth.user.id);
  return NextResponse.json({ draft });
}

export async function PATCH(request: Request) {
  if (!isMongoEnabled()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const badCt = requireJsonContentType(request);
  if (badCt) return badCt;

  const ip = getClientIp(request);
  const rl = checkRateLimit(
    `intake:draft:patch:${ip}`,
    INTAKE_DRAFT_RATE_LIMIT.max,
    INTAKE_DRAFT_RATE_LIMIT.windowMs
  );
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      }
    );
  }

  const auth = await requireVerifiedAuth(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body: unknown = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid draft", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (JSON.stringify(parsed.data.intake).length > MAX_DRAFT_JSON) {
      return NextResponse.json({ error: "Draft too large" }, { status: 413 });
    }

    const locale = (parsed.data.locale as Locale | undefined) ?? "en";
    await upsertIntakeDraft(
      auth.user.id,
      parsed.data.intake as Record<string, unknown>,
      {
        step: parsed.data.step,
        locale,
      }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
