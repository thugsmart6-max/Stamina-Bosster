import { getTranslations } from "next-intl/server";

export async function StartBanner() {
  const t = await getTranslations("studio");
  const awards = t.raw("awards") as string[];

  return (
    <section className="start-shell">
      <div className="style-night px-4 py-12 sm:py-20 md:px-10 md:py-28">
        <p className="display-heading text-3xl leading-[0.92] sm:text-5xl md:text-8xl">{t("bannerTitle")}</p>
        <p className="mt-4 text-xl text-white/80 sm:mt-6 sm:text-2xl md:text-4xl">{t("bannerSub")}</p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:mt-6">{t("bannerBody")}</p>
      </div>
      <div className="style-paper px-4 py-8 md:px-10 md:py-10">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{t("awardsTitle")}</h3>
        <ul className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
          {awards.map((item) => (
            <li key={item} className="py-4 text-sm md:text-base">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
