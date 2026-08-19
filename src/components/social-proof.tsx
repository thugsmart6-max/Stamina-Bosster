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
    <section className="style-field start-shell">
      <div className="border-b border-foreground/10 px-4 py-8 md:px-10 md:py-12">
        <p className="start-kicker">{s("eyebrow")}</p>
        <h2 className="display-heading mt-3 text-2xl sm:text-3xl md:text-5xl">{s("title")}</h2>
      </div>
      <div className="grid md:grid-cols-3">
        {testimonials.map((item, i) => (
          <blockquote
            key={item.author}
            className={`start-cell ${
              i === 0 ? "pillar-move" : i === 1 ? "pillar-fuel" : "pillar-recover"
            }`}
          >
            <p className="pillar-num text-[11px] font-bold tracking-[0.2em]">
              {String(i + 1).padStart(2, "0")} / 03
            </p>
            <p className="mt-6 text-sm leading-relaxed md:text-base">“{item.quote}”</p>
            <footer className="mt-8">
              <p className="text-sm font-medium">{item.author}</p>
              <p className="text-xs text-muted">{item.role}</p>
            </footer>
          </blockquote>
        ))}
      </div>
      <p className="border-t border-foreground/10 px-4 py-6 text-center text-xs text-muted md:px-10">
        {p("stats.satisfactionLabel")}. {s("resultsVary")}
      </p>
    </section>
  );
}
