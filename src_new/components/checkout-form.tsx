"use client";

import { AppIcon } from "@/components/app-icon";
import { DemoCheckoutBanner } from "@/components/demo-checkout-banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function CheckoutForm({ stripeEnabled }: { stripeEnabled: boolean }) {
  const router = useRouter();
  const t = useTranslations("checkout");
  const p = useTranslations("pricing");
  const footer = useTranslations("footer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptDisclaimer, setAcceptDisclaimer] = useState(false);
  const [email, setEmail] = useState("");
  const [card, setCard] = useState({
    cardNumber: "4242424242424242",
    expiry: "12/30",
    cvc: "123",
    nameOnCard: "Demo User",
  });

  const features = [0, 1, 2, 3].map((i) => p(`features.${i}`));

  async function payWithStripe() {
    if (!acceptDisclaimer) {
      setError(t("acceptDisclaimer"));
      return;
    }
    setLoading(true);
    setError("");
    track("checkout_started", { method: "stripe" });
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("errors.submit"));
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(t("errors.network"));
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-6">
      <Card className="border-primary/30 bg-primary/5">
        <p className="flex items-center gap-2 text-sm font-bold text-white">
          <AppIcon name="pdf" size={20} className="text-primary" />
          {p("planName")}
        </p>
        <p className="display-heading mt-2 flex items-center gap-2 text-4xl text-primary">
          <AppIcon name="navPricing" size={32} />
          {p("price")}
          <span className="text-lg text-muted"> {p("currency")}</span>
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <AppIcon name="checkBold" size={16} className="mt-0.5 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>
      </Card>

      <div>
        <Label htmlFor="email" className="flex items-center gap-2">
          <AppIcon name="email" size={16} />
          {t("email")}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-white/80">
        <input
          type="checkbox"
          checked={acceptDisclaimer}
          onChange={(e) => setAcceptDisclaimer(e.target.checked)}
          className="mt-1"
        />
        <span>
          {t("disclaimerLabel")}{" "}
          <Link href="/terms" className="text-primary underline">
            {footer("terms")}
          </Link>
          .
        </span>
      </label>

      {stripeEnabled ? (
        <Button
          type="button"
          variant="pill"
          className="w-full gap-2"
          size="lg"
          disabled={loading}
          onClick={payWithStripe}
        >
          <AppIcon name="lock" size={18} className="text-accent-foreground" />
          {loading ? t("redirecting") : t("getPlanPrice", { price: p("price") })}
        </Button>
      ) : null}

      {!stripeEnabled && <DemoCheckoutBanner />}

      {!stripeEnabled && (
        <Card>
          <form onSubmit={payDemo} className="space-y-4">
            <div>
              <Label htmlFor="nameOnCard" className="flex items-center gap-2">
                <AppIcon name="payment" size={16} />
                {t("name")}
              </Label>
              <Input
                id="nameOnCard"
                value={card.nameOnCard}
                onChange={(e) =>
                  setCard((c) => ({ ...c, nameOnCard: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">{t("demoCard")}</Label>
              <Input
                id="cardNumber"
                value={card.cardNumber}
                onChange={(e) =>
                  setCard((c) => ({ ...c, cardNumber: e.target.value }))
                }
              />
            </div>
            {error && <p className="text-sm text-red">{error}</p>}
            <Button
              type="submit"
              variant="pill"
              className="w-full gap-2"
              size="lg"
              disabled={loading}
            >
              <AppIcon name="payment" size={18} className="text-accent-foreground" />
              {loading ? t("redirecting") : t("demoPay")}
            </Button>
          </form>
        </Card>
      )}

      {stripeEnabled && error && <p className="text-sm text-red">{error}</p>}
    </div>
  );
}
