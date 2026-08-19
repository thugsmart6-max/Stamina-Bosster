import { NextResponse } from "next/server";

/** Real Stripe checkout is disabled for this launch. Use POST /api/checkout/demo. */
export async function POST() {
  return NextResponse.json(
    { error: "Stripe is disabled. Demo checkout only." },
    { status: 503 }
  );
}
