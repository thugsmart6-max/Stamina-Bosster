"use client";

import { AppIcon } from "@/components/app-icon";
import { DemoCheckoutBanner } from "@/components/demo-checkout-banner";
import { FaqAccordion } from "@/components/faq-accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  BASE_PRICE_INR,
  discountedPriceInr,
  formatInr,
  isPromoOfferActive,
  loadPromoOffer,
} from "@/lib/promo-offer";
import { useMemo, useState, useEffect, type ReactNode } from "react";

function TrustChip({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-foreground/10 py-4 last:border-b-0">
      <span className="text-[11px] font-bold tracking-[0.16em] text-muted">{index}</span>
      <p className="text-sm leading-snug text-foreground/85">{children}</p>
    </div>
  );
}

export function CheckoutForm({
  demoEnabled = false,
  defaultEmail = "",
}: {
  demoEnabled?: boolean;
  defaultEmail?: string;
}) {
  const router = useRouter();
  const t = useTranslations("checkout");
  const p = useTranslations("pricing");
  const footer = useTranslations("footer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptDisclaimer, setAcceptDisclaimer] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [promoPrice, setPromoPrice] = useState<number | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);

  useEffect(() => {
    const offer = loadPromoOffer();
    if (offer && isPromoOfferActive(offer)) {
      setPromoDiscount(offer.discountPercent);
      setPromoPrice(discountedPriceInr(offer.discountPercent));
    }
  }, []);
  const [card, setCard] = useState({
    cardNumber: "4242424242424242",
    expiry: "12/30",
    cvc: "123",
    nameOnCard: "Demo User",
  });

  const features = [0, 1, 2, 3].map((i) => p(`features.${i}`));

  const faqItems = useMemo(
    () => [
      { q: t("faq1Q"), a: t("faq1A") },
      { q: t("faq2Q"), a: t("faq2A") },
      { q: t("faq3Q"), a: t("faq3A") },
    ],
    [t]
  );

  if (!demoEnabled) {
    return (
      <div className="mx-auto max-w-lg border border-foreground/10 bg-[#fffbf6] p-8 text-center">
        <AppIcon name="warning" size={32} className="mx-auto text-warning" />
        <p className="mt-4 text-sm leading-relaxed text-muted">{t("billingUnavailable")}</p>
      </div>
    );
  }

  async function payDemo(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptDisclaimer) {
      setError(t("acceptDisclaimer"));
      return;
    }
    setLoading(true);
    setError("");
    track("checkout_started", { method: "demo" });
    try {
      const res = await fetch("/api/checkout/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...card,
          email: email || undefined,
          acceptDisclaimer: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("errors.submit"));
        return;
      }
      track("purchase_completed", { method: "demo" });
      router.push(`/success/${data.orderId}`);
    } catch {
      setError(t("errors.network"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-checkout-shell="true" className="start-split start-grid">
      <aside className="start-dark flex flex-col justify-between px-5 py-8 md:px-10 md:py-14 lg:sticky lg:top-20 lg:min-h-[calc(100dvh-5rem)]">
        <div>
          <p className="start-kicker text-primary">{t("orderSummary")}</p>
          <h2 className="display-heading mt-4 text-balance text-3xl md:text-4xl">
            {t("valueHeadline")}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            {t("valueSubDemo")}
          </p>
          <p className="display-heading mt-8 flex flex-wrap items-baseline gap-2 text-[clamp(2.35rem,11vw,3.75rem)] text-white md:mt-10">
            {promoPrice !== null ? (
              <>
                <span>{formatInr(promoPrice)}</span>
                <span className="text-lg text-white/35 line-through">{formatInr(BASE_PRICE_INR)}</span>
              </>
            ) : (
              <>
                {p("price")}
                <span className="text-base font-semibold tracking-normal text-white/55">
                  {p("currency")}
                </span>
              </>
            )}
          </p>
          <p className="mt-2 text-sm text-white/80">{p("planName")}</p>
          {promoDiscount !== null ? (
            <p className="mt-2 text-xs font-semibold text-primary">
              {t("promoApplied", { discount: promoDiscount })}
            </p>
          ) : null}
        </div>
        <ol className="mt-10 border-t border-white/15">
          {features.map((f, i) => (
            <li
              key={f}
              className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-white/15 py-4 text-sm text-white/80"
            >
              <span className="text-[11px] font-bold tracking-[0.16em] text-white/45">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ol>
      </aside>

      <div className="bg-[#fffbf6] px-4 py-8 md:px-10 md:py-12">
        <p className="start-kicker">02</p>
        <h3 className="display-heading mt-3 text-2xl">{t("title")}</h3>
        <div className="mt-8 max-w-lg">
          <Label htmlFor="checkout-email" className="mb-2 flex items-center gap-2 text-sm">
            <AppIcon name="email" size={16} className="text-primary" />
            {t("email")}
          </Label>
          <Input
            id="checkout-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="vp-focus-ring"
          />

          <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-foreground/10 pt-6 text-sm text-foreground/85">
            <input
              type="checkbox"
              checked={acceptDisclaimer}
              onChange={(e) => setAcceptDisclaimer(e.target.checked)}
              className={cn(
                "mt-1 h-[18px] w-[18px] shrink-0 rounded border-foreground/20 bg-white accent-primary",
                "vp-focus-ring"
              )}
            />
            <span className="leading-relaxed">
              {t("disclaimerLabel")}{" "}
              <Link href="/terms" className="font-semibold text-primary underline-offset-2 hover:underline">
                {footer("terms")}
              </Link>
              .
            </span>
          </label>

          <div className="mt-6">
            <DemoCheckoutBanner />
          </div>
          <form onSubmit={payDemo} className="mt-6 space-y-5 border-t border-foreground/10 pt-6">
            <div>
              <Label htmlFor="nameOnCard" className="mb-2 flex items-center gap-2 text-sm">
                <AppIcon name="payment" size={16} className="text-primary" />
                {t("name")}
              </Label>
              <Input
                id="nameOnCard"
                value={card.nameOnCard}
                onChange={(e) => setCard((c) => ({ ...c, nameOnCard: e.target.value }))}
                className="vp-focus-ring"
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">{t("demoCard")}</Label>
              <Input
                id="cardNumber"
                value={card.cardNumber}
                onChange={(e) => setCard((c) => ({ ...c, cardNumber: e.target.value }))}
                className="vp-focus-ring mt-2"
              />
            </div>
            {error ? (
              <p className="text-sm text-red" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="start-pill start-pill--invert inline-flex w-full gap-2"
              disabled={loading}
            >
              <AppIcon name="payment" size={16} />
              {loading ? t("redirecting") : t("demoPay")}
            </button>
          </form>
        </div>

        <div className="mt-12 max-w-lg border-t border-foreground/10 pt-8">
          <p className="start-kicker mb-2">{t("secureLabelDemo")}</p>
          <TrustChip index="01">{t("trustDemoTls")}</TrustChip>
          <TrustChip index="02">{t("trustDemoNoCharge")}</TrustChip>
          <TrustChip index="03">{t("trustDemoPdf")}</TrustChip>
        </div>

        <div className="mt-10 max-w-lg">
          <p className="start-kicker mb-4">{t("faqTitle")}</p>
          <FaqAccordion items={faqItems} variant="grid" />
        </div>
      </div>
    </div>
  );
}
