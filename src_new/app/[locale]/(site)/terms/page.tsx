import { PageShell } from "@/components/page-shell";
import { getTranslations } from "next-intl/server";

export default async function TermsPage() {
  const t = await getTranslations("legal");

  return (
    <PageShell title={t("termsTitle")} subtitle={t("termsSubtitle")}>
      <div className="prose prose-invert max-w-none space-y-6 text-sm text-muted">
        <p>{t("disclaimer")}</p>
      </div>
    </PageShell>
  );
}
