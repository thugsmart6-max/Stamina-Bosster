import { requireVerifiedAuth } from "@/lib/auth/guards";
import { getLatestPlanSessionForUser } from "@/lib/session-store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = await requireVerifiedAuth(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const session = await getLatestPlanSessionForUser(auth.user.id);
  if (!session) {
    return NextResponse.json({ session: null });
  }

  return NextResponse.json({
    session: {
      sessionId: session.sessionId,
      intake: session.intake,
      plan: session.plan,
      locale: session.locale,
      createdAt: session.createdAt,
    },
  });
}
