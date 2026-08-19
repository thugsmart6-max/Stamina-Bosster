import { getCurrentUser } from "@/lib/auth/guards";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect({ href: "/login", locale: locale as Locale });
  }

  redirect({ href: "/dashboard", locale: locale as Locale });
}
