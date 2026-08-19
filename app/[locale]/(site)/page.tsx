import { LandingFaqSection } from "@/components/landing-faq-section";
import { StartBanner } from "@/components/start-banner";
import { StartHero } from "@/components/start-hero";
import { StartPulse } from "@/components/start-pulse";
import { SocialProof } from "@/components/social-proof";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  const steps = [0, 1, 2].map((i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: t(`steps.${i}.title`),
    body: t(`steps.${i}.body`),
  }));

  return (
    <div className="start-shell style-paper overflow-x-hidden">
      <StartHero />
      <StartBanner />
      <SocialProof />
      <StartPulse />

      <section id="how" className="style-paper start-shell">
        <div className="border-b border-foreground/10 px-4 py-8 md:px-10 md:py-10">
          <h2 className="display-heading text-3xl sm:text-4xl md:text-6xl">
            {t("howTitle1")} {t("howTitle2")}
          </h2>
        </div>
        <div className="grid md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.num} className="start-cell">
              <p className="pillar-num text-[11px] font-bold tracking-[0.2em]">{s.num}</p>
              <h3 className="display-heading mt-4 text-2xl md:text-3xl">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <LandingFaqSection />
    </div>
  );
}
