"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type AuthPageLayoutProps = {
  variant: "login" | "signup";
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthPageLayout({
  variant,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: AuthPageLayoutProps) {
  const t = useTranslations("auth");
  const c = useTranslations("common");

  useEffect(() => {
    document.body.classList.add("auth-route");
    return () => document.body.classList.remove("auth-route");
  }, []);

  return (
    <section
      data-auth-shell="true"
      data-auth-variant={variant}
      className={cn("auth-page start-shell relative w-full", className)}
    >
      <h1 id="auth-page-title" className="sr-only">
        {title}
      </h1>
      <div className="start-split start-grid min-h-[calc(100dvh-4.5rem)]">
        <aside className="start-dark hidden flex-col justify-end px-10 py-14 lg:flex">
          <p className="start-kicker text-primary">{eyebrow}</p>
          <p className="display-heading mt-5 max-w-md text-5xl leading-[0.95]">
            {title}
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{subtitle}</p>
        </aside>

        <div className="flex items-center justify-center bg-[#fffbf6] px-5 py-10 md:px-12">
          <div className="w-full max-w-md" role="region" aria-labelledby="auth-page-title">
            <header className="mb-8 lg:hidden">
              <p className="start-kicker">{eyebrow}</p>
              <p className="display-heading mt-3 text-balance text-[clamp(1.5rem,7vw,1.75rem)] leading-tight">
                {title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
            </header>

            {children}

            <footer className="mt-8 border-t border-foreground/10 pt-5">
              <Link href="/" className="start-link text-muted hover:text-foreground">
                {t("backToHome", { brand: c("brand") })}
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
