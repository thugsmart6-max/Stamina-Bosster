import { NextResponse } from "next/server";

/** Stripe webhooks are unused while checkout is demo-only. */
export async function POST() {
  return NextResponse.json(
    { error: "Stripe is disabled. Demo checkout only." },
    { status: 503 }
  );
}
