import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { AuthUser } from "@/lib/types";
import { getCurrentUser } from "./guards";

/** Server-side guard for pages that require authentication. */
export async function requireVerifiedUserPage(
  locale: Locale,
  nextPath = "/start"
): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect({
      href: `/login?next=${encodeURIComponent(nextPath)}`,
      locale,
    });
  }

  return user!;
}
