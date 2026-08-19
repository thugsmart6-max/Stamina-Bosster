"use client";

import { AppIcon } from "@/components/app-icon";
import { Link, useRouter } from "@/i18n/navigation";
import type { AuthUser, PlanResult } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function DashboardHome({ user }: { user: AuthUser }) {
  const t = useTranslations("dashboard");
  const authT = useTranslations("auth");
  const router = useRouter();
  const [lastPlan, setLastPlan] = useState<PlanResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPlan = async () => {
      try {
        const raw = sessionStorage.getItem("vp_plan");
        if (raw) {
          if (!cancelled) setLastPlan(JSON.parse(raw) as PlanResult);
          return;
        }
      } catch {
        /* fall through to API */
      }

      try {
        const res = await fetch("/api/intake/latest");
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { session?: { plan?: PlanResult } | null };
        if (data.session?.plan) {
          setLastPlan(data.session.plan);
          sessionStorage.setItem("vp_plan", JSON.stringify(data.session.plan));
        }
      } catch {
        if (!cancelled) setLastPlan(null);
      }
    };

    void loadPlan();
    return () => {
      cancelled = true;
    };
  }, []);

  const wellnessIndex = lastPlan
    ? Math.round(Math.min(100, Math.max(0, lastPlan.readinessScore * 10)))
    : null;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="space-y-0">
      <div className="border-b border-foreground/10 pb-8">
        <p className="start-kicker">01</p>
        <h1 className="display-heading mt-3 text-3xl text-foreground md:text-5xl">
          {t("welcome", { name: user.fullName.split(" ")[0] ?? user.fullName })}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">{t("welcomeSubtitle")}</p>
      </div>

      <div className="start-grid grid lg:grid-cols-3">
        <div className="start-cell lg:col-span-2">
          <p className="start-kicker">{t("healthScore")}</p>
          {wellnessIndex !== null ? (
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="display-heading text-5xl text-foreground md:text-6xl">{wellnessIndex}</p>
                <p className="mt-2 text-sm text-muted">
                  {authT("dashboardWellnessScore", { score: lastPlan!.readinessScore })}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/preview" className="start-pill bg-accent text-accent-foreground">
                  {authT("dashboardViewPreview")}
                </Link>
                <Link href="/dashboard/reports" className="start-pill">
                  {t("recentReports")}
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm text-muted">{authT("dashboardWellnessEmpty")}</p>
              <Link href="/start" className="start-pill mt-4 inline-flex">
                {authT("dashboardContinue")}
              </Link>
            </div>
          )}
        </div>

        <div className="start-cell">
          <p className="start-kicker">{t("subscription")}</p>
          <p className="display-heading mt-4 text-2xl">{t("planPremium")}</p>
          <p className="mt-2 text-sm text-muted">{t("subscriptionActive")}</p>
        </div>
      </div>

      <div className="start-cell mt-0 border-x-0">
        <p className="start-kicker">03</p>
        <h2 className="display-heading mt-3 text-2xl text-foreground">{authT("profileCardTitle")}</h2>
        <dl className="mt-6 grid gap-px bg-foreground/10 sm:grid-cols-2">
          <div className="bg-[#fffbf6] p-5">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">{authT("fullName")}</dt>
            <dd className="mt-2 font-medium text-foreground">{user.fullName}</dd>
          </div>
          <div className="bg-[#fffbf6] p-5">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">{authT("email")}</dt>
            <dd className="mt-2 font-medium text-foreground">{user.email}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/start?edit=1" className="start-pill inline-flex gap-2">
            <AppIcon name="intakeBody" size={16} />
            {t("editOnboarding")}
          </Link>
          <Link href="/dashboard/settings" className="start-pill">
            {t("editProfile")}
          </Link>
          <button type="button" className="start-pill" onClick={logout}>
            {authT("logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
