import { resolveFunnelState } from "@/lib/auth/funnel-state";
import { getCurrentUser } from "@/lib/auth/guards";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const funnel = await resolveFunnelState(user.id, request);

  return NextResponse.json({
    user,
    redirectTo: funnel.redirectTo,
    intakeDone: funnel.intakeDone,
    paid: funnel.paid,
  });
}
