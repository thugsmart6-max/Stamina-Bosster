import { cookies } from "next/headers";

export const INTAKE_DONE_COOKIE = "vp_intake_done";
export const PAID_ACCESS_COOKIE = "vp_paid_access";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function setIntakeDoneCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(INTAKE_DONE_COOKIE, "1", COOKIE_OPTS);
}

export async function hasIntakeDoneCookie(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(INTAKE_DONE_COOKIE)?.value === "1";
}

export async function setPaidAccessCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(PAID_ACCESS_COOKIE, "1", COOKIE_OPTS);
}

export async function hasPaidAccessCookie(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(PAID_ACCESS_COOKIE)?.value === "1";
}

export function readPaidAccessFromRequest(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${PAID_ACCESS_COOKIE}=1(?:;|$)`).test(cookie);
}

export function readIntakeDoneFromRequest(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${INTAKE_DONE_COOKIE}=1(?:;|$)`).test(cookie);
}
