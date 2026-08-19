import { AppIcon } from "@/components/app-icon";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const legal = await getTranslations("legal");
  const common = await getTranslations("common");

  return (
    <footer className="mt-auto border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <AppIcon name="logo" size={20} />
              </span>
              <span className="display-heading text-2xl leading-none">
                VITALITY
                <br />
                PATH
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              {t("tagline")}
            </p>
            <p className="mt-2 text-xs text-muted">{common("gstNote")}</p>
          </div>
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
              <AppIcon name="navHow" size={14} className="text-primary" />
              {t("platform")}
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 hover:text-primary"
                >
                  <AppIcon name="stepQuestionnaire" size={16} />
                  {t("start")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 hover:text-primary"
                >
                  <AppIcon name="navPricing" size={16} />
                  {t("pricingFaq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#how"
                  className="inline-flex items-center gap-2 hover:text-primary"
                >
                  <AppIcon name="stepPreview" size={16} />
                  {common("howItWorks")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
              <AppIcon name="shield" size={14} className="text-primary" />
              {t("legal")}
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 hover:text-primary"
                >
                  <AppIcon name="lock" size={16} />
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-2 hover:text-primary"
                >
                  <AppIcon name="legalDocument" size={16} />
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-sm text-muted sm:col-span-2 lg:col-span-1">
            <p className="flex items-center gap-2">
              <AppIcon name="warning" size={16} className="text-warning" />
              {t("ageNote")}
            </p>
            <p className="mt-2">{common("reportVersion")}</p>
          </div>
        </div>
        <p className="mb-4 border-t border-white/10 pt-8 text-xs leading-relaxed text-muted">
          {legal("disclaimer")}
        </p>
        <p className="text-xs text-muted/60">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
