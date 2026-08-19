import { FaqAccordion } from "@/components/faq-accordion";
import { getTranslations } from "next-intl/server";

export async function LandingFaqSection() {
  const t = await getTranslations("home.faq");

  const faq = [0, 1, 2, 3, 4].map((i) => ({
    q: t(`items.${i}.q`),
    a: t(`items.${i}.a`),
  }));

  return (
    <section id="faq" className="style-field start-shell">
      <div className="border-b border-foreground/10 px-4 py-8 md:px-10 md:py-12">
        <h2 className="display-heading flex items-center gap-3 text-2xl text-foreground sm:text-3xl md:text-6xl">
          <span className="inline-block h-2 w-2 rounded-full bg-foreground" aria-hidden />
          {t("title")}
        </h2>
      </div>
      <div className="px-4 py-6 md:px-10 md:py-10">
        <FaqAccordion items={faq} variant="grid" />
      </div>
    </section>
  );
}
