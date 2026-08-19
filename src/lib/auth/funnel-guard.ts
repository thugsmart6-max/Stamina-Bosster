import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  hasIntakeDoneCookie,
  hasPaidAccessCookie,
} from "@/lib/funnel-cookies";
import { requireVerifiedUserPage } from "./page-guard";

export async function requireIntakeCompletePage(
  locale: Locale,
  nextPath: string
) {
  const user = await requireVerifiedUserPage(locale, nextPath);
  const done = await hasIntakeDoneCookie();
  if (!done) {
    redirect({ href: "/start", locale });
  }
  return user;
}

export async function requirePaidAccessPage(locale: Locale, nextPath: string) {
  const user = await requireVerifiedUserPage(locale, nextPath);
  const paid = await hasPaidAccessCookie();
  if (!paid) {
    redirect({ href: "/checkout", locale });
  }
  return user;
}
