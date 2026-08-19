"use client";

import type { Locale } from "@/i18n/routing";
import { getLocalizedGuideContent } from "@/lib/performance-guide-locale";
import { cn } from "@/lib/utils";

function GuideTable({
  headers,
  rows,
  className,
  layout = "auto",
  chrome = "default",
}: {
  headers: string[];
  rows: string[][];
  className?: string;
  layout?: "auto" | "wide" | "narrow";
  chrome?: "default" | "start";
}) {
  const minWidth =
    layout === "wide" ? "min-w-[560px] lg:min-w-0" : layout === "narrow" ? "min-w-[420px] lg:min-w-0" : "min-w-[480px] lg:min-w-0";
  const start = chrome === "start";

  return (
    <div className={cn("guide-table-block", className)}>
      <div className="guide-table-cards lg:hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            className={
              start
                ? "border-t border-foreground/10 py-5 first:border-t-0"
                : "rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4"
            }
          >
            <p className="text-sm font-semibold leading-snug text-foreground">{row[0]}</p>
            <dl className="mt-3 space-y-2">
              {headers.slice(1).map((header, j) => (
                <div key={header} className="grid gap-0.5">
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    {header}
                  </dt>
                  <dd className="text-sm leading-relaxed text-foreground/75">{row[j + 1]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className={cn("guide-table-wrap hidden lg:block", minWidth)}>
        <table className={cn("guide-table w-full text-left text-sm", minWidth)}>
          <thead>
            <tr className={start ? "border-b border-foreground/10" : "border-b border-[#c4921a]/20 bg-soft/70"}>
              {headers.map((h) => (
                <th
                  key={h}
                  className={cn(
                    "px-0 py-3 text-[10px] font-bold uppercase tracking-[0.18em] xl:py-3",
                    start ? "text-muted" : "px-3 text-[#c4921a] xl:px-4"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-foreground/10">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "align-top leading-relaxed",
                      start ? "px-0 py-4" : "px-3 py-2.5 xl:px-4 xl:py-3",
                      j === 0 ? "font-semibold text-foreground" : "text-foreground/75"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={cn("guide-table-wrap hidden md:block lg:hidden", minWidth)}>
        <p className="guide-table-scroll-hint mb-2 text-[10px] font-medium uppercase tracking-widest text-muted">
          Swipe table →
        </p>
        <table className={cn("guide-table w-full text-left text-sm", minWidth)}>
          <thead>
            <tr className={start ? "border-b border-foreground/10" : "border-b border-[#c4921a]/20 bg-soft/70"}>
              {headers.map((h) => (
                <th
                  key={h}
                  className={cn(
                    "whitespace-nowrap py-2.5 text-[10px] font-bold uppercase tracking-[0.18em]",
                    start ? "px-3 text-muted" : "px-3 text-[#c4921a]"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-foreground/10">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "px-3 py-2.5 align-top text-xs leading-relaxed",
                      j === 0 ? "min-w-[7rem] font-semibold text-foreground" : "min-w-[8rem] text-foreground/75"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  variant = "default",
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "warning" | "success";
}) {
  const accent =
    variant === "warning"
      ? "text-warning"
      : variant === "success"
        ? "text-positive"
        : "text-primary";

  return (
    <section className="border-b border-foreground/10 px-4 py-6 sm:px-5 sm:py-8 md:px-8 md:py-10">
      <h2
        className={cn(
          "flex flex-wrap items-start gap-2 text-base font-bold sm:text-lg md:text-xl",
          accent
        )}
      >
        <span aria-hidden className="shrink-0">
          {icon}
        </span>
        <span className="report-section-title min-w-0 flex-1 !text-base sm:!text-lg md:!text-xl">
          {title}
        </span>
      </h2>
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

function StartBlock({
  num,
  title,
  pillar,
  children,
}: {
  num: string;
  title: string;
  pillar?: "pillar-move" | "pillar-fuel" | "pillar-recover";
  children: React.ReactNode;
}) {
  return (
    <article className={cn("bg-[var(--paper)] px-5 py-12 md:px-10", pillar)}>
      <p className="pillar-num text-[11px] font-bold tracking-[0.2em]">{num}</p>
      <h3 className="display-heading mt-3 text-3xl md:text-4xl">{title}</h3>
      <div className="mt-8">{children}</div>
    </article>
  );
}

export function PerformanceGuideHtml({
  locale,
  className,
  variant = "default",
}: {
  locale: Locale;
  className?: string;
  variant?: "default" | "start";
}) {
  const g = getLocalizedGuideContent(locale);
  const h = g.headers;
  const start = variant === "start";
  const tableChrome = start ? "start" : "default";

  if (start) {
    return (
      <article className={cn("style-paper start-shell", className)}>
        <div className="grid gap-px bg-foreground/10">
          <StartBlock num="03" title={g.sections.exercisesDo} pillar="pillar-move">
            <GuideTable
              chrome={tableChrome}
              layout="wide"
              headers={[h.exercise, h.how, h.frequency, h.benefit]}
              rows={g.exercises.map((r) => [r.exercise, r.how, r.frequency, r.benefit])}
            />
            <p className="mt-6 border-t border-foreground/10 pt-5 text-sm leading-relaxed text-primary">
              {g.exerciseWarning}
            </p>
          </StartBlock>

          <StartBlock num="04" title={g.sections.avoid}>
            <GuideTable
              chrome={tableChrome}
              layout="narrow"
              headers={[h.avoid, h.reason]}
              rows={g.avoid.map((r) => [r.item, r.reason])}
            />
          </StartBlock>

          <StartBlock num="05" title={g.sections.foodsIndian} pillar="pillar-fuel">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              {g.sections.foodsTamil}
            </p>
            <GuideTable
              chrome={tableChrome}
              layout="narrow"
              headers={[h.food, h.why]}
              rows={g.foodsTamil.map((r) => [r.food, r.why])}
              className="mb-10"
            />
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              {g.sections.foodsHindi}
            </p>
            <GuideTable
              chrome={tableChrome}
              layout="narrow"
              headers={[h.food, h.why]}
              rows={g.foodsHindi.map((r) => [r.food, r.why])}
              className="mb-10"
            />
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              {g.sections.foodsPan}
            </p>
            <GuideTable
              chrome={tableChrome}
              layout="narrow"
              headers={[h.food, h.why]}
              rows={g.foodsPan.map((r) => [r.food, r.why])}
            />
          </StartBlock>

          <StartBlock num="06" title={g.sections.improvePerformance} pillar="pillar-recover">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              {g.sections.dailyRoutine}
            </p>
            <GuideTable
              chrome={tableChrome}
              layout="narrow"
              headers={[h.time, h.action]}
              rows={g.dailyRoutine.map((r) => [r.time, r.action])}
              className="mb-10"
            />
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              {g.sections.healthChecks}
            </p>
            <GuideTable
              chrome={tableChrome}
              layout="narrow"
              headers={[h.check, h.why]}
              rows={g.healthChecks.map((r) => [r.check, r.why])}
              className="mb-10"
            />
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              {g.sections.lifestyleHabits}
            </p>
            <ul>
              {g.lifestyleHabits.map((habit) => (
                <li
                  key={habit}
                  className="border-t border-foreground/10 py-3 text-sm leading-relaxed text-foreground/85"
                >
                  {habit}
                </li>
              ))}
            </ul>
          </StartBlock>

          <StartBlock num="07" title={g.sections.doctor}>
            <GuideTable
              chrome={tableChrome}
              layout="narrow"
              headers={[h.sign, h.doctorAction]}
              rows={g.doctor.map((r) => [r.sign, r.action])}
            />
            <p className="mt-6 text-sm leading-relaxed text-muted">{g.doctorFootnote}</p>
          </StartBlock>
        </div>
        <p className="border-t border-foreground/10 px-5 py-8 text-xs leading-relaxed text-muted md:px-10">
          {g.disclaimer}
        </p>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "performance-guide-html overflow-hidden rounded-xl border border-foreground/10 bg-surface sm:rounded-2xl",
        className
      )}
    >
      <header className="border-b border-foreground/10 bg-gradient-to-br from-primary/25 via-surface to-background px-4 py-8 text-center sm:px-5 sm:py-10 md:px-8 md:py-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c4921a] sm:tracking-[0.28em]">
          Stamina Booster · Educational guide
        </p>
        <h1 className="display-heading mx-auto mt-3 max-w-3xl text-pretty text-[clamp(1.2rem,3.5vw,2rem)] leading-tight text-foreground">
          {g.title}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-xs leading-relaxed text-muted sm:mt-4 sm:text-sm">
          {g.subtitle}
        </p>
      </header>

      <Section icon="✅" title={g.sections.exercisesDo} variant="success">
        <GuideTable
          layout="wide"
          headers={[h.exercise, h.how, h.frequency, h.benefit]}
          rows={g.exercises.map((r) => [r.exercise, r.how, r.frequency, r.benefit])}
        />
        <p className="mt-4 rounded-xl border border-warning/30 bg-warning/10 px-3 py-3 text-xs leading-relaxed text-warning sm:px-4 sm:text-sm">
          ⚠️ {g.exerciseWarning}
        </p>
      </Section>

      <Section icon="❌" title={g.sections.avoid} variant="warning">
        <GuideTable
          layout="narrow"
          headers={[h.avoid, h.reason]}
          rows={g.avoid.map((r) => [r.item, r.reason])}
        />
      </Section>

      <Section icon="🥗" title={g.sections.foodsIndian}>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">
          {g.sections.foodsTamil}
        </h3>
        <GuideTable
          layout="narrow"
          headers={[h.food, h.why]}
          rows={g.foodsTamil.map((r) => [r.food, r.why])}
          className="mb-6 sm:mb-8"
        />

        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">
          {g.sections.foodsHindi}
        </h3>
        <GuideTable
          layout="narrow"
          headers={[h.food, h.why]}
          rows={g.foodsHindi.map((r) => [r.food, r.why])}
          className="mb-6 sm:mb-8"
        />

        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">
          {g.sections.foodsPan}
        </h3>
        <GuideTable
          layout="narrow"
          headers={[h.food, h.why]}
          rows={g.foodsPan.map((r) => [r.food, r.why])}
        />
      </Section>

      <Section icon="🎯" title={g.sections.improvePerformance}>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#c4921a] sm:text-xs">
          {g.sections.dailyRoutine}
        </h3>
        <GuideTable
          layout="narrow"
          headers={[h.time, h.action]}
          rows={g.dailyRoutine.map((r) => [r.time, r.action])}
          className="mb-6 sm:mb-8"
        />

        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#c4921a] sm:text-xs">
          {g.sections.healthChecks}
        </h3>
        <GuideTable
          layout="narrow"
          headers={[h.check, h.why]}
          rows={g.healthChecks.map((r) => [r.check, r.why])}
          className="mb-6 sm:mb-8"
        />

        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#c4921a] sm:text-xs">
          {g.sections.lifestyleHabits}
        </h3>
        <ul className="space-y-2 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-3 sm:space-y-2.5 sm:p-4">
          {g.lifestyleHabits.map((habit) => (
            <li key={habit} className="flex gap-2 text-xs leading-relaxed text-foreground/85 sm:text-sm">
              <span className="shrink-0 text-positive">✅</span>
              <span className="min-w-0">{habit}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon="🚨" title={g.sections.doctor} variant="warning">
        <GuideTable
          layout="narrow"
          headers={[h.sign, h.doctorAction]}
          rows={g.doctor.map((r) => [r.sign, r.action])}
        />
        <p className="mt-4 text-xs leading-relaxed text-muted sm:text-sm">{g.doctorFootnote}</p>
      </Section>

      <footer className="px-4 py-5 text-center text-[11px] leading-relaxed text-muted sm:px-5 sm:py-6 sm:text-xs md:px-8">
        {g.disclaimer}
      </footer>
    </article>
  );
}
