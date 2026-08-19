import { stripLocalePrefixes } from "@/i18n/routing";

/** Paths where ₹ pricing, pricing nav, and checkout CTAs must stay hidden. */
const HIDE_PRICING_EXACT = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/start",
]);

const HIDE_PRICING_PREFIX = ["/forgot-password/"];

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === "") return "/";
  const withoutQuery = pathname.split("?")[0] ?? pathname;
  const stripped = stripLocalePrefixes(withoutQuery);
  if (stripped.length > 1 && stripped.endsWith("/")) {
    return stripped.slice(0, -1);
  }
  return stripped;
}

export function shouldHidePricing(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (HIDE_PRICING_EXACT.has(path)) return true;
  return HIDE_PRICING_PREFIX.some((p) => path.startsWith(p));
}

export function isMinimalFunnelChrome(pathname: string): boolean {
  const path = normalizePath(pathname);
  return (
    path === "/start" ||
    path === "/pricing" ||
    path === "/checkout" ||
    path === "/preview" ||
    path.startsWith("/success/")
  );
}
