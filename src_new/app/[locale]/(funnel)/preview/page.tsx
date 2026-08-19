import { hasPaidAccessCookie } from "@/lib/funnel-cookies";
import { requireIntakeCompletePage } from "@/lib/auth/funnel-guard";
import { PreviewPageClient } from "@/components/preview-page-client";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function FunnelPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireIntakeCompletePage(locale as Locale, "/preview");
  const paid = await hasPaidAccessCookie();
  if (!paid) {
    redirect({ href: "/checkout", locale: locale as Locale });
  }
  return <PreviewPageClient unlocked />;
}
