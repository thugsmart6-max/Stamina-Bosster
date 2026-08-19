import { AppIcon } from "@/components/app-icon";
import { getTranslations } from "next-intl/server";

export async function SocialProof() {
  const s = await getTranslations("social");
  const p = await getTranslations("pricing");

  const testimonials = [0, 1, 2].map((i) => ({
    quote: p(`testimonials.${i}.quote`),
    author: p(`testimonials.${i}.author`),
    role: p(`testimonials.${i}.role`),
  }));

  return (
    <section className="border-y border-white/10 px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <AppIcon name="star" size={14} />
              {s("eyebrow")}
            </p>
            <h2 className="display-heading mt-2 text-3xl text-white md:text-4xl">
              {s("title")}
            </h2>
          </div>
          <div className="flex gap-8 text-center">
            <div>
              <p className="display-heading flex items-center justify-center gap-2 text-2xl text-primary">
                <AppIcon name="pdf" size={22} />
                {p("stats.plansGenerated")}
              </p>
              <p className="text-xs text-muted">{s("plansLabel")}</p>
            </div>
            <div>
              <p className="display-heading flex items-center justify-center gap-2 text-2xl text-white">
                <AppIcon name="stepQuestionnaire" size={22} />
                {p("stats.avgCompletionMinutes")} min
              </p>
              <p className="text-xs text-muted">{s("minLabel")}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.author} className="card-dark flex flex-col p-6">
              <div className="mb-3 flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AppIcon key={i} name="star" size={16} />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-white/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-4 flex items-center gap-2 text-xs font-bold text-white">
                <AppIcon name="confidence" size={16} className="text-primary" />
                {t.author}
              </p>
              <p className="text-xs text-muted">{t.role}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          {p("stats.satisfactionLabel")}. {s("resultsVary")}
        </p>
      </div>
    </section>
  );
}
