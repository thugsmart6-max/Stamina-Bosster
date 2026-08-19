"use client";

import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

const FEATURE = { src: "/media/walk.png", labelIndex: 0 };
const TILES = [
  { src: "/media/stretch.jpg", labelIndex: 1 },
  { src: "/media/salmon.jpg", labelIndex: 2 },
  { src: "/media/squat.jpg", labelIndex: 4 },
] as const;

export function StartHero() {
  const t = useTranslations("studio");
  const c = useTranslations("common");
  const reduce = useReducedMotion();
  const rotate = t.raw("rotate") as string[];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || rotate.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % rotate.length), 2200);
    return () => window.clearInterval(id);
  }, [reduce, rotate.length]);

  return (
    <section
      id="studio-hero"
      className="style-night relative overflow-hidden pt-[calc(4.25rem+env(safe-area-inset-top))] lg:min-h-[100svh] lg:pt-[calc(4.75rem+env(safe-area-inset-top))]"
    >
      <div className="start-orb" aria-hidden />
      <div className="start-hero-grid" aria-hidden />

      <div className="start-hero-fill relative z-10">
        <div className="start-hero-copy border-b border-white/10 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <p className="start-kicker text-primary">{rotate[i] ?? rotate[0]}</p>
          <p className="display-heading mt-4 max-w-[14ch] text-[clamp(1.85rem,9vw,6.4rem)] leading-[0.88] tracking-[-0.06em] sm:mt-5">
            {t("tagline")}
          </p>
          <h1 className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg md:text-2xl md:leading-tight">
            {t("headline")}
          </h1>
          <Link
            href="/signup"
            className="start-pill start-pill--invert mt-6 inline-flex w-full justify-center sm:mt-8 sm:w-auto"
          >
            {c("getPlan")}
          </Link>
        </div>

        <HeroTile
          src={FEATURE.src}
          label={t(`works.${FEATURE.labelIndex}.label`)}
          className="start-hero-feature border-b border-white/10 lg:border-l"
          reduce={reduce}
          priority
        />

        <div className="start-hero-tiles">
          {TILES.map((tile) => (
            <HeroTile
              key={tile.src}
              src={tile.src}
              label={t(`works.${tile.labelIndex}.label`)}
              className="start-hero-tile border-b border-white/10 sm:border-l sm:first:border-l-0 lg:border-l lg:first:border-l"
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroTile({
  src,
  label,
  className,
  reduce,
  priority = false,
}: {
  src: string;
  label: string;
  className: string;
  reduce: boolean | null;
  priority?: boolean;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Image
        src={src}
        alt={label}
        fill
        className="object-cover opacity-90"
        sizes={
          priority
            ? "(max-width: 1023px) 100vw, 42vw"
            : "(max-width: 639px) 100vw, (max-width: 1023px) 33vw, 25vw"
        }
        priority={priority}
      />
      <span className="start-work__label">{label}</span>
    </motion.div>
  );
}
