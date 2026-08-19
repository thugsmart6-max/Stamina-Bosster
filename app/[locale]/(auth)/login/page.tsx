import { AuthFormSkeleton } from "@/components/auth-form-skeleton";
import { AuthPageLayout } from "@/components/auth-page-layout";
import { LoginForm } from "@/components/login-form";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <AuthPageLayout
      variant="login"
      eyebrow={t("loginEyebrow")}
      title={t("loginTitle")}
      subtitle={t("loginSubtitle")}
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthPageLayout>
  );
}
