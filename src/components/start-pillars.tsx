import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function StartPillars({
  ctaHref = "/#how",
}: {
  ctaHref?: string | null;
}) {
  const t = await getTranslations("studio");

  const pillars = [0, 1, 2].map((i) => ({
    num: t(`pillars.${i}.num`),
    title: t(`pillars.${i}.title`),
    body: t(`pillars.${i}.body`),
    items: t.raw(`pillars.${i}.items`) as string[],
  }));

  return (
    <section className="style-paper start-shell">
      <div className="grid border-b border-foreground/10 md:grid-cols-2">
        <div className="px-4 py-16 md:px-10">
          <h2 className="display-heading max-w-lg text-3xl md:text-5xl">{t("aboutTitle")}</h2>
        </div>
        <div className="border-t border-foreground/10 px-4 py-16 md:border-l md:border-t-0 md:px-10">
          <p className="max-w-md text-sm leading-relaxed text-muted md:text-base">{t("aboutBody")}</p>
          {ctaHref ? (
            <Link href={ctaHref} className="start-link mt-8 text-foreground">
              {t("aboutCta")}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-px bg-foreground/10 md:grid-cols-3">
        {pillars.map((pillar, i) => (
          <article
            key={pillar.num}
            className={`bg-[var(--paper)] px-4 py-12 md:px-8 ${
              i === 0 ? "pillar-move" : i === 1 ? "pillar-fuel" : "pillar-recover"
            }`}
          >
            <p className="pillar-num text-[11px] font-bold tracking-[0.2em]">{pillar.num}</p>
            <h3 className="display-heading mt-3 text-3xl">{pillar.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{pillar.body}</p>
            <ul className="mt-8">
              {pillar.items.map((item) => (
                <li key={item} className="border-t border-foreground/10 py-3 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
