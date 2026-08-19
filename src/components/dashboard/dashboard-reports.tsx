"use client";

import { AppIcon } from "@/components/app-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardOrders } from "@/components/dashboard/use-dashboard-orders";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function DashboardReports() {
  const t = useTranslations("dashboard.reports");
  const authT = useTranslations("auth");
  const { orders, loading } = useDashboardOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-heading text-3xl text-foreground">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center">
          <AppIcon name="pdf" size={40} className="mx-auto text-primary" />
          <p className="mt-4 text-sm text-muted">{authT("noOrders")}</p>
          <Link href="/start" className="mt-6 inline-block">
            <Button variant="pill">{t("generateFirst")}</Button>
          </Link>
        </Card>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.orderId}>
              <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-foreground">{o.name}</p>
                  <p className="text-xs text-muted">
                    {new Date(o.createdAt).toLocaleDateString()} · {o.status}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/dashboard/reports/${o.orderId}`}>
                    <Button variant="pill" size="sm" className="gap-2">
                      <AppIcon name="pdf" size={16} className="text-accent-foreground" />
                      {t("viewReport")}
                    </Button>
                  </Link>
                  <a href={`/api/download/${o.orderId}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <AppIcon name="pdf" size={16} />
                      {authT("download")}
                    </Button>
                  </a>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
