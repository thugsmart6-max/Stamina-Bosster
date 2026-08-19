"use client";

import { AuthPageLayout } from "@/components/auth-page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function ForgotPasswordFlow() {
  const t = useTranslations("auth");

  return (
    <AuthPageLayout
      variant="login"
      eyebrow={t("loginEyebrow")}
      title={t("forgotPasswordTitle")}
      subtitle={t("forgotPasswordSubtitle")}
    >
      <p className="text-sm leading-relaxed text-muted">{t("forgotPasswordBody")}</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link href="/login">
          <Button variant="pill" className="w-full">
            {t("forgotPasswordBackToLogin")}
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline" className="w-full">
            {t("forgotPasswordCreateAccount")}
          </Button>
        </Link>
      </div>
    </AuthPageLayout>
  );
}
