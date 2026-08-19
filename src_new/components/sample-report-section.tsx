import { AppIcon } from "@/components/app-icon";
import { getMediaUrl } from "@/lib/content";
import type { IconName } from "@/lib/icons";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

const SAMPLE_META: { imageKey: string; icon: IconName }[] = [
  { imageKey: "walk", icon: "bmi" },
  { imageKey: "squat", icon: "exercise" },
  { imageKey: "salmon", icon: "nutrition" },
];

export async function SampleReportSection() {
  const t = await getTranslations("sampleReport");

  const samples = SAMPLE_META.map((m, i) => ({
    ...m,
    title: t(`pages.${i}.title`),
    subtitle: t(`pages.${i}.subtitle`),
  }));

  return (
    <section className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="flex items-center justify-center gap-2 text-center text-xs font-bold uppercase tracking-widest text-primary">
          <AppIcon name="pdf" size={16} />
          {t("eyebrow")}
        </p>
        <h2 className="display-heading mt-2 text-center text-3xl text-white md:text-4xl">
          {t("title")}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {samples.map((s) => (
            <div
              key={s.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={getMediaUrl(s.imageKey)}
                  alt={s.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/30 text-primary backdrop-blur-sm">
                    <AppIcon name={s.icon} size={20} />
                  </span>
                  <h3 className="font-bold text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-muted">{s.subtitle}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 rounded bg-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
