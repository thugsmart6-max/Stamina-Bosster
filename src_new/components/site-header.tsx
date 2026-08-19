import { AppIcon } from "@/components/app-icon";
import { getCurrentUser, isFullyVerified } from "@/lib/auth/guards";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const c = await getTranslations("common");
  const user = await getCurrentUser();
  const verified = user ? isFullyVerified(user) : false;
  const ctaHref = verified ? "/start" : "/signup";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <AppIcon name="logo" size={24} />
          </span>
          <span className="display-heading text-lg leading-none md:text-xl">
            VITALITY
            <br />
            PATH
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-widest text-white/70 md:flex">
          <Link
            href="/#trap"
            className="flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <AppIcon name="navGap" size={16} />
            {t("gap")}
          </Link>
          <Link
            href="/#guide"
            className="flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <AppIcon name="nutrition" size={16} />
            {t("guide")}
          </Link>
          <Link
            href="/#how"
            className="flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <AppIcon name="navHow" size={16} />
            {t("how")}
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <AppIcon name="navPricing" size={16} />
            {t("pricing")}
          </Link>
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <AppIcon name="stepPreview" size={16} />
              {t("account")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <AppIcon name="lock" size={16} />
              {t("login")}
            </Link>
          )}
        </nav>
        <Link href={ctaHref} className="btn-pill flex items-center gap-2 text-xs md:text-sm">
          {c("getPlan")}
          <AppIcon name="ctaArrow" size={16} className="text-accent-foreground" />
        </Link>
      </div>
    </header>
  );
}
