"use client";

import { AppIcon } from "@/components/app-icon";
import { AiLoader } from "@/components/ai-loader";
import { LiveBmi } from "@/components/live-bmi";
import type { IconName } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { track } from "@/lib/analytics";
import type { IntakeData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";

const DRAFT_KEY = "vp_intake_draft";

const STEP_ICONS: IconName[] = [
  "intakeBasics",
  "intakeBody",
  "intakeLifestyle",
  "intakeGoals",
];

const GOAL_ICONS: Record<IntakeData["goal"], IconName> = {
  stamina: "goalStamina",
  energy: "goalEnergy",
  confidence: "goalConfidence",
  general_fitness: "goalFitness",
};

const selectClass =
  "w-full rounded-xl border border-white/15 bg-black px-4 py-2.5 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

const defaultForm: IntakeData = {
  name: "",
  age: 30,
  weight: 75,
  weightUnit: "kg",
  height: 175,
  heightUnit: "cm",
  sex: "prefer_not",
  goal: "stamina",
  activity: "sedentary",
  smoking: false,
  alcohol: "weekly",
  redFlags: ["none"],
};

export function IntakeWizard() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("intake");
  const c = useTranslations("common");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<IntakeData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    track("intake_started");
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setForm({ ...defaultForm, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  const progressPct = Math.round(((step + 1) / STEP_ICONS.length) * 100);

  const update = <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleRedFlag = (flag: IntakeData["redFlags"][number]) => {
    if (flag === "none") {
      update("redFlags", ["none"]);
      return;
    }
    setForm((f) => {
      const without = f.redFlags.filter((x) => x !== "none" && x !== flag);
      const next = without.includes(flag)
        ? without.filter((x) => x !== flag)
        : [...without, flag];
      return { ...f, redFlags: next.length ? next : ["none"] };
    });
  };

  const submit = useCallback(async () => {
    setError("");
    setShowAi(true);
  }, []);

  const onAiComplete = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("errors.submit"));
        setShowAi(false);
        return;
      }
      sessionStorage.setItem("vp_plan", JSON.stringify(data.plan));
      sessionStorage.setItem("vp_intake", JSON.stringify(form));
      if (data.sessionId) {
        sessionStorage.setItem("vp_session", data.sessionId);
      }
      localStorage.removeItem(DRAFT_KEY);
      track("intake_completed");
      router.push("/preview");
    } catch {
      setError(t("errors.network"));
      setShowAi(false);
    } finally {
      setLoading(false);
    }
  }, [form, router]);

  if (showAi) {
    return (
      <Card>
        <AiLoader onComplete={onAiComplete} />
        {loading && (
          <p className="pb-8 text-center text-sm text-muted">{t("saving")}</p>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
        {t("stepOf", {
          current: step + 1,
          total: STEP_ICONS.length,
          pct: progressPct,
        })}
      </p>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="mb-6 flex gap-2">
        {STEP_ICONS.map((icon, i) => (
          <div
            key={icon}
            className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2 text-center text-[10px] font-bold uppercase tracking-wide sm:flex-row sm:text-xs ${
              i <= step
                ? "bg-primary text-foreground"
                : "bg-white/10 text-muted"
            }`}
          >
            <AppIcon name={icon} size={14} />
            <span className="hidden sm:inline">{t(`steps.${i}`)}</span>
          </div>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red/30 bg-red/10 px-3 py-2 text-sm text-red">
          {error}
        </p>
      )}

      <AnimatePresence mode="wait">
      {step === 0 && (
        <motion.div
          key="s0"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={t("namePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="age">{t("age")}</Label>
            <Input
              id="age"
              type="number"
              min={18}
              max={100}
              value={form.age}
              onChange={(e) => update("age", Number(e.target.value))}
            />
          </div>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div
          key="s1"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          className="space-y-4"
        >
          <LiveBmi form={form} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">{t("weight")}</Label>
              <Input
                id="weight"
                type="number"
                value={form.weight}
                onChange={(e) => update("weight", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="weightUnit">{t("unit")}</Label>
              <select
                id="weightUnit"
                className={selectClass}
                value={form.weightUnit}
                onChange={(e) =>
                  update("weightUnit", e.target.value as "kg" | "lb")
                }
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">{t("height")}</Label>
              <Input
                id="height"
                type="number"
                value={form.height}
                onChange={(e) => update("height", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="heightUnit">{t("unit")}</Label>
              <select
                id="heightUnit"
                className={selectClass}
                value={form.heightUnit}
                onChange={(e) =>
                  update("heightUnit", e.target.value as "cm" | "ft")
                }
              >
                <option value="cm">cm</option>
                <option value="ft">{t("heightFtHint")}</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          key="s2"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          className="space-y-4"
        >
          <div>
            <Label>{t("activity")}</Label>
            <select
              className={selectClass}
              value={form.activity}
              onChange={(e) =>
                update("activity", e.target.value as IntakeData["activity"])
              }
            >
              {(["sedentary", "light", "moderate", "active"] as const).map(
                (id) => (
                  <option key={id} value={id}>
                    {t(`activityLevels.${id}`)}
                  </option>
                )
              )}
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.smoking}
              onChange={(e) => update("smoking", e.target.checked)}
            />
            <span className="text-sm text-white/80">{t("smoking")}</span>
          </label>
          <div>
            <Label>{t("alcohol")}</Label>
            <select
              className={selectClass}
              value={form.alcohol}
              onChange={(e) =>
                update("alcohol", e.target.value as IntakeData["alcohol"])
              }
            >
              {(["rarely", "weekly", "daily"] as const).map((id) => (
                <option key={id} value={id}>
                  {t(`alcoholLevels.${id}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>{t("screening")}</Label>
            <div className="mt-2 space-y-2 text-sm text-white/80">
              {(
                [
                  "none",
                  "chest_pain",
                  "persistent_ed",
                  "new_meds",
                  "severe_fatigue",
                ] as const
              ).map((id) => (
                <label key={id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.redFlags.includes(id)}
                    onChange={() => toggleRedFlag(id)}
                  />
                  {t(`redFlags.${id}`)}
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="s3"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          className="space-y-4"
        >
          <Label>{t("goal")}</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              ["stamina", "energy", "confidence", "general_fitness"] as const
            ).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => update("goal", id)}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-bold uppercase tracking-wide transition-colors ${
                  form.goal === id
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-white/15 text-white/70 hover:border-white/30"
                }`}
              >
                <AppIcon name={GOAL_ICONS[id]} size={22} />
                {t(`goals.${id}`)}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          {c("back")}
        </Button>
        {step < STEP_ICONS.length - 1 ? (
          <Button
            type="button"
            variant="pill"
            onClick={() => {
              if (step === 0 && form.name.length < 2) {
                setError(t("errors.name"));
                return;
              }
              setError("");
              setStep((s) => s + 1);
            }}
          >
            {c("next")}
          </Button>
        ) : (
          <Button type="button" variant="pill" onClick={submit} className="gap-2">
            <AppIcon name="sparkles" size={18} className="text-accent-foreground" />
            {t("generate")}
          </Button>
        )}
      </div>
    </Card>
  );
}
