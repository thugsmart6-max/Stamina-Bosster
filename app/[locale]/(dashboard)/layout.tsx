import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentUser } from "@/lib/auth/guards";
import { requirePaidAccessPage } from "@/lib/auth/funnel-guard";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function DashboardRouteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect({ href: "/login?next=/dashboard", locale: locale as Locale });
  }

  await requirePaidAccessPage(locale as Locale, "/dashboard");

  return <DashboardShell user={user!}>{children}</DashboardShell>;
}
