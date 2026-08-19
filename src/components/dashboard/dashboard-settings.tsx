"use client";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import type { AuthUser } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function DashboardSettings({ user }: { user: AuthUser }) {
  const t = useTranslations("dashboard.settings");
  const authT = useTranslations("auth");
  const { toast } = useToast();
  const router = useRouter();
  const [fullName, setFullName] = useState(user.fullName);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      if (!res.ok) throw new Error("failed");
      toast({ title: t("saved"), variant: "success" });
    } catch {
      toast({ title: t("saveError"), variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div>
      <div className="start-cell border-x-0">
        <p className="start-kicker">01</p>
        <h1 className="display-heading mt-3 text-3xl text-foreground md:text-5xl">{t("title")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">{t("subtitle")}</p>
      </div>

      <form onSubmit={saveProfile} className="start-cell space-y-5 border-x-0">
        <p className="start-kicker">{t("profileSection")}</p>
        <div>
          <label htmlFor="settings-name" className="text-sm text-muted">
            {authT("fullName")}
          </label>
          <Input
            id="settings-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <label htmlFor="settings-email" className="text-sm text-muted">
            {authT("email")}
          </label>
          <Input id="settings-email" value={user.email} disabled className="mt-2 opacity-60" />
        </div>
        <button type="submit" className="start-pill start-pill--invert" disabled={saving}>
          {saving ? t("saving") : t("saveProfile")}
        </button>
      </form>

      <div className="start-cell border-x-0">
        <p className="start-kicker">{t("notificationsSection")}</p>
        <label className="mt-5 flex items-center justify-between gap-4 border-t border-foreground/10 pt-5">
          <span className="text-sm text-foreground/90">{t("emailUpdates")}</span>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>
      </div>

      <div className="start-cell border-x-0">
        <p className="start-kicker">{t("securitySection")}</p>
        <p className="mt-3 text-sm text-muted">{t("passwordHint")}</p>
        <button type="button" className="start-pill mt-6" onClick={logout}>
          {authT("logout")}
        </button>
      </div>
    </div>
  );
}
