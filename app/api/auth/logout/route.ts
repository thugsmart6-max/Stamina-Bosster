import { clearAuthCookie } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
