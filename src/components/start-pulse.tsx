import { getTranslations } from "next-intl/server";

export async function StartPulse() {
  const t = await getTranslations("home");

  return (
    <section id="trap" className="style-paper start-shell">
      <div className="border-b border-foreground/10 px-4 py-8 md:px-10 md:py-10">
        <h2 className="display-heading flex items-center gap-3 text-2xl sm:text-3xl md:text-5xl">
          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-foreground" aria-hidden />
          {t("pulseTitle")}
        </h2>
      </div>
      <ol>
        {[0, 1, 2, 3, 4].map((i) => (
          <li
            key={i}
            className="grid gap-2 border-b border-foreground/10 px-4 py-6 md:grid-cols-[8rem_1fr] md:gap-3 md:px-10 md:py-8"
          >
            <p className="start-kicker mt-1">{t(`traps.${i}.tag`)}</p>
            <div>
              <p className="display-heading text-2xl md:text-3xl">{t(`traps.${i}.title`)}</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {t(`traps.${i}.body`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
