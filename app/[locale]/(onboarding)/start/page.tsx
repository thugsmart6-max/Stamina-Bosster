import { IntakeWizard } from "@/components/intake-wizard";
import { requireVerifiedUserPage } from "@/lib/auth/page-guard";
import type { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireVerifiedUserPage(locale as Locale, "/start");

  const t = await getTranslations("intake");

  return (
    <IntakeWizard
      features={[
        t("onboardingBullet1"),
        t("onboardingBullet2"),
        t("onboardingBullet3"),
      ]}
    />
  );
}
