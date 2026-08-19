"use client";

import { AppIcon } from "@/components/app-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useRouter } from "@/i18n/navigation";
import type { AuthUser, PlanResult } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type OrderSummary = {
  orderId: string;
  name: string;
  status: string;
  createdAt: string;
  blobUrl?: string;
};

export function AccountClient({ user }: { user: AuthUser }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [lastPlan, setLastPlan] = useState<PlanResult | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("vp_plan");
      if (raw) setLastPlan(JSON.parse(raw) as PlanResult);
    } catch {
      setLastPlan(null);
    }
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          {t("dashboardSectionTitle")}
        </p>
        <h2 className="mt-2 display-heading text-3xl text-foreground md:text-4xl">{t("accountTitle")}</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{t("accountSubtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-6 lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">
            {t("dashboardWellnessTitle")}
          </h3>
          {lastPlan ? (
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="display-heading text-5xl text-primary">
                  {Math.round(Math.min(100, Math.max(0, lastPlan.readinessScore * 10)))}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {t("dashboardWellnessScore", { score: lastPlan.readinessScore })}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/preview">
                  <Button variant="pill" className="gap-2">
                    <AppIcon name="pdf" size={18} className="text-accent-foreground" />
                    {t("dashboardViewPreview")}
                  </Button>
                </Link>
                <Link href="/checkout">
                  <Button variant="secondary" className="gap-2">
                    <AppIcon name="navPricing" size={18} />
                    {t("checkoutCta")}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-muted">{t("dashboardWellnessEmpty")}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/start">
              <Button variant="outline" className="gap-2">
                <AppIcon name="practice" size={18} />
                {lastPlan ? t("aiAssistantCta") : t("dashboardContinue")}
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="border-primary/20 bg-primary/[0.06] p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            {t("aiAssistantTitle")}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t("aiAssistantBody")}</p>
          <Link href="/start" className="mt-5 inline-block">
            <Button variant="pill" size="sm" className="w-full gap-2">
              <AppIcon name="sparkles" size={16} className="text-accent-foreground" />
              {t("aiAssistantCta")}
            </Button>
          </Link>
        </Card>
      </div>

      <Card className="p-6 md:p-8">
        <h3 className="display-heading text-xl text-foreground">{t("profileCardTitle")}</h3>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex flex-wrap justify-between gap-4 border-b border-foreground/10 py-3">
            <dt className="text-muted">{t("fullName")}</dt>
            <dd className="font-medium text-foreground">{user.fullName}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-4 border-b border-foreground/10 py-3">
            <dt className="text-muted">{t("email")}</dt>
            <dd className="font-medium text-foreground">{user.email}</dd>
          </div>
          {user.phone ? (
            <div className="flex flex-wrap justify-between gap-4 py-3">
              <dt className="text-muted">{t("phone")}</dt>
              <dd className="font-medium text-foreground">{user.phone}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/start">
            <Button variant="pill" className="gap-2">
              <AppIcon name="practice" size={18} className="text-accent-foreground" />
              {t("newPlan")}
            </Button>
          </Link>
          <Button type="button" variant="outline" onClick={logout}>
            {t("logout")}
          </Button>
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted">{t("orderHistory")}</h3>
        {ordersLoading ? (
          <div className="mt-6 space-y-3">
            <p className="text-xs text-muted">{t("ordersLoading")}</p>
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("noOrders")}</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {orders.map((o) => (
              <li
                key={o.orderId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4"
              >
                <div>
                  <p className="font-bold text-foreground">{o.name}</p>
                  <p className="text-xs text-muted">
                    {new Date(o.createdAt).toLocaleDateString()} · {o.status}
                  </p>
                </div>
                <a href={`/api/download/${o.orderId}`}>
                  <Button type="button" variant="outline" size="sm" className="gap-2">
                    <AppIcon name="pdf" size={16} />
                    {t("download")}
                  </Button>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
