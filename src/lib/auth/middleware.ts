import { jwtVerify } from "jose";
import { AUTH_COOKIE, type AuthTokenPayload } from "./session";

const PROTECTED = ["/start", "/preview", "/checkout", "/account", "/dashboard"];
const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET ?? "dev-only-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function readAuthFromRequest(
  request: Request
): Promise<AuthTokenPayload | null> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]+)`));
  const token = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sub = payload.sub;
    if (!sub || typeof sub !== "string") return null;
    return {
      sub,
      email: String(payload.email ?? ""),
    };
  } catch {
    return null;
  }
}

export function stripLocalePath(
  pathname: string,
  locales: readonly string[]
): { locale: string; path: string } {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return { locale, path: "/" };
    }
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) };
    }
  }
  return { locale: "en", path: pathname };
}

export function isProtectedPath(path: string): boolean {
  return PROTECTED.some((p) => path === p || path.startsWith(`${p}/`));
}

export function isAuthPage(path: string): boolean {
  return AUTH_PAGES.some((p) => path === p || path.startsWith(`${p}/`));
}
