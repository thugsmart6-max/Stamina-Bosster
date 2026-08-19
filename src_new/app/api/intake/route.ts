import { requireVerifiedAuth } from "@/lib/auth/guards";
import { setIntakeDoneCookie } from "@/lib/funnel-cookies";
import { locales, type Locale } from "@/i18n/routing";
import { generatePlan } from "@/lib/rules-engine";
import { deleteIntakeDraft, saveSession } from "@/lib/session-store";
import { setSessionCookie } from "@/lib/session-cookie";
import { intakeSchema } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const auth = await requireVerifiedAuth(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { locale: rawLocale, ...intakeBody } = body as {
      locale?: string;
      [key: string]: unknown;
    };
    const locale = locales.includes(rawLocale as Locale)
      ? (rawLocale as Locale)
      : "en";

    const parsed = intakeSchema.safeParse(intakeBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid intake", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const flags = parsed.data.redFlags.filter((f) => f !== "none");
    if (flags.length === 0 && !parsed.data.redFlags.includes("none")) {
      parsed.data.redFlags = ["none"];
    }

    const intake = {
      ...parsed.data,
      name: parsed.data.name || auth.user.fullName,
    };

    const sessionId = uuidv4();
    const plan = generatePlan(intake, locale);

    await saveSession({
      sessionId,
      userId: auth.user.id,
      intake,
      plan,
      locale,
      createdAt: new Date().toISOString(),
    });

    await deleteIntakeDraft(auth.user.id);

    await setSessionCookie(sessionId);
    await setIntakeDoneCookie();

    return NextResponse.json({
      sessionId,
      plan: {
        bmi: plan.bmi,
        bmiCategory: plan.bmiCategory,
        readinessScore: plan.readinessScore,
        exerciseIds: plan.exerciseIds,
        eatFoodIds: plan.eatFoodIds,
        limitFoodIds: plan.limitFoodIds,
        medicalBlock: plan.medicalBlock,
        introParagraph: plan.introParagraph,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
