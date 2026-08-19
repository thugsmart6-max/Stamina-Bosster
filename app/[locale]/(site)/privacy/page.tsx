import { PageShell } from "@/components/page-shell";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("legal");
  const paragraphs = [0, 1, 2, 3, 4].map((i) => t(`privacyBody.${i}`));

  return (
    <PageShell title={t("privacyTitle")} subtitle={t("privacySubtitle")}>
      <div className="prose prose-invert max-w-none space-y-6 text-sm text-muted">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </PageShell>
  );
}
