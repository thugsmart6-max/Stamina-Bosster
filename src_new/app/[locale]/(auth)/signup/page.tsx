import { AuthPageLayout } from "@/components/auth-page-layout";
import { SignupForm } from "@/components/signup-form";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const t = await getTranslations("auth");

  return (
    <AuthPageLayout
      variant="signup"
      eyebrow={t("signupEyebrow")}
      title={t("signupTitle")}
      subtitle={t("signupSubtitle")}
    >
      <SignupForm />
    </AuthPageLayout>
  );
}
