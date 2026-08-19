import { locales, type Locale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth/guards";
import { generateFullReportPdf } from "@/lib/pdf/generate";
import { getSession, saveSession } from "@/lib/session-store";
import { getSessionIdFromCookie } from "@/lib/session-cookie";
import { intakeSchema, type IntakeData, type PlanResult } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const previewBodySchema = z.object({
  intake: intakeSchema.optional(),
  plan: z
    .object({
      bmi: z.number(),
      bmiCategory: z.enum(["underweight", "normal", "overweight", "obese"]),
      readinessScore: z.number(),
      exerciseIds: z.array(z.string()),
      eatFoodIds: z.array(z.string()),
      limitFoodIds: z.array(z.string()),
      dietVariantKey: z.enum(["underweight", "normal", "overweight"]),
      timelineKey: z.literal("range_4_8_weeks"),
      medicalBlock: z.boolean(),
      introParagraph: z.string(),
    })
    .optional(),
  locale: z.string().optional(),
  sessionId: z.string().optional(),
});

async function resolveSession(
  sessionId: string | undefined,
  body: z.infer<typeof previewBodySchema>,
  userId?: string
) {
  if (sessionId) {
    const existing = await getSession(sessionId);
    if (existing) return existing;
  }

  if (body.plan && body.intake) {
    const locale = locales.includes(body.locale as Locale)
      ? (body.locale as Locale)
      : "en";
    const id = body.sessionId ?? sessionId ?? `preview-${Date.now()}`;
    const record = {
      sessionId: id,
      userId,
      intake: body.intake as IntakeData,
      plan: body.plan as PlanResult,
      locale,
      createdAt: new Date().toISOString(),
    };
    await saveSession(record);
    return record;
  }

  return undefined;
}

export async function POST(request: Request) {
  let body: z.infer<typeof previewBodySchema> = {};
  try {
    const raw = await request.json();
    const parsed = previewBodySchema.safeParse(raw);
    if (parsed.success) body = parsed.data;
  } catch {
    /* empty body: cookie-only session */
  }

  const user = await getCurrentUser(request);
  const cookieSessionId = await getSessionIdFromCookie();
  const sessionId = body.sessionId ?? cookieSessionId;

  const session = await resolveSession(sessionId, body, user?.id);
  if (!session) {
    return NextResponse.json(
      { error: "Session expired — complete the questionnaire again." },
      { status: 404 }
    );
  }

  try {
    const locale = locales.includes(session.locale as Locale)
      ? (session.locale as Locale)
      : "en";

    const pdf = await generateFullReportPdf({
      intake: session.intake,
      plan: session.plan,
      watermark: true,
      locale,
    });

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="preview-plan.pdf"',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
