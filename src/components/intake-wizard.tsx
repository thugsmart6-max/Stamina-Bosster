"use client";

import { AppIcon } from "@/components/app-icon";
import { AiLoader } from "@/components/ai-loader";
import { LiveBmi } from "@/components/live-bmi";
import type { IconName } from "@/lib/icons";
import {
  decimalFeetFromParts,
  feetInchesFromDecimal,
  hasScreeningFlags,
  validateIntakeStep,
} from "@/lib/intake-validation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { previewWellnessIndex } from "@/lib/readiness-preview";
import type { IntakeData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";

const DRAFT_KEY = "vp_intake_draft";

const STEP_HINT_KEYS = [
  null,
  "hints.goal",
  "hints.name",
  "hints.weight",
  "hints.activity",
  "hints.habits",
  "hints.screening",
  null,
] as const;

const STEP_ICONS: IconName[] = [
  "sparkles",
  "intakeGoals",
  "intakeBasics",
  "intakeBody",
  "intakeLifestyle",
  "nutrition",
  "intakeScreening",
  "check",
];

const GOAL_CHOICES: {
  value: IntakeData["goal"];
  labelKey:
    | "goalChoices.stamina"
    | "goalChoices.energy"
    | "goalChoices.erections"
    | "goalChoices.health"
    | "goalChoices.weightLoss";
}[] = [
  { value: "confidence", labelKey: "goalChoices.erections" },
  { value: "stamina", labelKey: "goalChoices.stamina" },
  { value: "energy", labelKey: "goalChoices.energy" },
  { value: "general_fitness", labelKey: "goalChoices.health" },
  { value: "weight_loss", labelKey: "goalChoices.weightLoss" },
];

const QUALITY_CHOICES: {
  value: IntakeData["erectionQuality"];
  labelKey:
    | "erectionQualityOptions.firm"
    | "erectionQualityOptions.mixed"
    | "erectionQualityOptions.soft";
}[] = [
  { value: "soft", labelKey: "erectionQualityOptions.soft" },
  { value: "mixed", labelKey: "erectionQualityOptions.mixed" },
  { value: "firm", labelKey: "erectionQualityOptions.firm" },
];

const selectClass =
  "w-full min-h-12 border border-foreground/15 bg-white px-3 text-base text-foreground focus:border-primary focus:outline-none";

const fieldInputClass =
  "rounded-none border border-foreground/15 bg-white px-3 min-h-12 text-base shadow-none focus:border-primary focus:ring-0";

const fieldLabelClass = "mb-2 block text-sm font-semibold text-foreground";

const defaultForm: IntakeData = {
  name: "",
  age: 30,
  weight: 75,
  weightUnit: "kg",
  height: 175,
  heightUnit: "cm",
  sex: "male",
  goal: "confidence",
  activity: "sedentary",
  smoking: false,
  alcohol: "weekly",
  redFlags: ["none"],
  dietPreference: "none",
  sleepHours: "7_8",
  stressLevel: "medium",
  exerciseMinutes: "20_40",
  erectionQuality: "mixed",
};

function OptionPills<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="start-cell">
      <p className={fieldLabelClass}>{label}</p>
      {hint ? <p className="text-xs leading-relaxed text-muted">{hint}</p> : null}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={selected}
              className={cn(
                "start-pill min-h-11 w-full justify-center px-3 py-2.5 text-[11px] sm:w-auto sm:px-4",
                selected && "start-pill--invert"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FieldHint({ text }: { text: string }) {
  return <p className="mt-2 text-xs leading-relaxed text-muted">{text}</p>;
}

function StartChoice({
  index,
  selected,
  onClick,
  children,
}: {
  index: number;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex min-h-14 w-full items-center gap-4 border-b border-foreground/10 px-5 py-4 text-left md:px-8",
        selected ? "bg-primary/10" : "hover:bg-foreground/[0.03]"
      )}
    >
      <span className="w-8 shrink-0 text-[11px] font-bold tracking-[0.16em] text-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1 text-base font-medium leading-snug text-foreground">
        {children}
      </span>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center border",
          selected
            ? "border-primary bg-primary text-white"
            : "border-foreground/20 bg-white text-transparent"
        )}
        aria-hidden
      >
        <AppIcon name="check" size={14} />
      </span>
    </button>
  );
}

export function IntakeWizard({
  features = [],
}: {
  features?: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";
  const locale = useLocale() as Locale;
  const t = useTranslations("intake");
  const c = useTranslations("common");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<IntakeData>(defaultForm);
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(9);
  const [showAi, setShowAi] = useState(false);
  const [error, setError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [allowServerDraft, setAllowServerDraft] = useState(false);
  const [navigatingToPreview, setNavigatingToPreview] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setAllowServerDraft(true), 2000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    track("intake_started");
    let cancelled = false;

    const run = async () => {
      let merged: IntakeData = { ...defaultForm };
      let userFullName = "";

      try {
        const authRes = await fetch("/api/auth/me");
        if (authRes.ok) {
          const authData = (await authRes.json()) as {
            user?: { fullName?: string };
          };
          userFullName = authData.user?.fullName?.trim() ?? "";
        }
      } catch {
        /* ignore */
      }

      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          merged = { ...defaultForm, ...JSON.parse(raw) } as IntakeData;
        }
      } catch {
        /* ignore */
      }

      try {
        if (editMode) {
          const latestRes = await fetch("/api/intake/latest");
          if (!cancelled && latestRes.ok) {
            const latestData = (await latestRes.json()) as {
              session?: {
                intake?: Partial<IntakeData>;
                plan?: unknown;
                sessionId?: string;
              } | null;
            };
            if (latestData?.session?.intake) {
              merged = {
                ...merged,
                ...(latestData.session.intake as Partial<IntakeData>),
              } as IntakeData;
              if (latestData.session.plan) {
                sessionStorage.setItem(
                  "vp_plan",
                  JSON.stringify(latestData.session.plan)
                );
              }
              if (latestData.session.sessionId) {
                sessionStorage.setItem(
                  "vp_session",
                  latestData.session.sessionId
                );
              }
              sessionStorage.setItem("vp_intake", JSON.stringify(merged));
            }
          }
        } else {
          const res = await fetch("/api/intake/draft");
          if (!cancelled && res.ok) {
            const data = (await res.json()) as {
              draft: {
                intake?: Record<string, unknown>;
                step?: number;
              } | null;
            };
            if (data?.draft?.intake && typeof data.draft.intake === "object") {
              merged = {
                ...merged,
                ...(data.draft.intake as Partial<IntakeData>),
              } as IntakeData;
              if (typeof data.draft.step === "number") {
                let nextStep = data.draft.step;
                if (nextStep === 5) nextStep = 7;
                setStep(
                  Math.max(0, Math.min(STEP_ICONS.length - 1, nextStep))
                );
              }
            }
          }
        }
      } catch {
        /* ignore */
      }

      if (userFullName && merged.name.trim().length < 2) {
        merged = { ...merged, name: userFullName };
      }

      if (cancelled) return;
      setForm({
        ...defaultForm,
        ...merged,
        sex: "male",
        erectionQuality: merged.erectionQuality ?? "mixed",
      });
      if (merged.heightUnit === "ft") {
        const { feet, inches } = feetInchesFromDecimal(merged.height);
        setHeightFeet(feet);
        setHeightInches(inches);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [editMode]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step, showAi]);

  useEffect(() => {
    if (!allowServerDraft || showAi) return;
    const handle = window.setTimeout(() => {
      void fetch("/api/intake/draft", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intake: form as unknown as Record<string, unknown>,
          step,
          locale,
        }),
      }).then((r) => {
        if (r.ok) {
          setDraftSaved(true);
          window.setTimeout(() => setDraftSaved(false), 2000);
        }
      });
    }, 800);
    return () => window.clearTimeout(handle);
  }, [form, step, locale, showAi, allowServerDraft]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setDraftSaved(true);
      const id = setTimeout(() => setDraftSaved(false), 2000);
      return () => clearTimeout(id);
    } catch {
      /* ignore */
    }
  }, [form]);

  const progressPct = Math.round(((step + 1) / STEP_ICONS.length) * 100);

  const update = <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const syncHeightFromFtIn = (feet: number, inches: number) => {
    setHeightFeet(feet);
    setHeightInches(inches);
    update("height", decimalFeetFromParts(feet, inches));
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

  const goNext = () => {
    const errKey = validateIntakeStep(step, form);
    if (errKey) {
      setError(t(`errors.${errKey}` as "errors.name"));
      return;
    }
    setError("");
    setStep((s) => s + 1);
  };

  const submit = useCallback(() => {
    setError("");
    setShowAi(true);
    void (async () => {
      const started = Date.now();
      try {
        const res = await fetch("/api/intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, sex: "male", locale }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/login?next=/start");
            return;
          }
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
        track(editMode ? "intake_updated" : "intake_completed");
        const wait = 1100 - (Date.now() - started);
        if (wait > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, wait));
        }
        setNavigatingToPreview(true);
        router.push(editMode ? "/dashboard" : "/checkout");
      } catch {
        setError(t("errors.network"));
        setShowAi(false);
      }
    })();
  }, [editMode, form, locale, router, t]);

  const screeningWarning = step === 6 && hasScreeningFlags(form);
  const previewScore = previewWellnessIndex(form);
  const stepHint = STEP_HINT_KEYS[step] ? t(STEP_HINT_KEYS[step]!) : t("pageSubtitle");

  const renderNav = () => (
    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        disabled={step === 0 || showAi}
        className="start-pill min-h-12 w-full sm:w-auto"
        onClick={() => {
          setError("");
          setStep((s) => s - 1);
        }}
      >
        {c("back")}
      </button>
      {step < STEP_ICONS.length - 1 ? (
        <button
          type="button"
          onClick={goNext}
          disabled={showAi}
          className="start-pill start-pill--invert start-pill--cta"
        >
          {c("next")}
        </button>
      ) : (
        <button
          type="button"
          onClick={submit}
          disabled={showAi}
          className="start-pill start-pill--invert start-pill--cta inline-flex justify-center gap-2"
        >
          <AppIcon name="sparkles" size={16} />
          {t("generate")}
        </button>
      )}
    </div>
  );

  const renderProgress = () => (
    <div
      className="h-1 overflow-hidden bg-white/15"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressPct}
      aria-label={t("stepProgressLabel")}
    >
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${progressPct}%` }}
      />
    </div>
  );

  return (
    <div data-onboarding-shell="true" className="start-split start-grid">
      <div className="style-night px-5 py-5 lg:hidden">
        <p className="start-kicker flex items-center gap-3 text-primary">
          <span aria-hidden>{String(step + 1).padStart(2, "0")}</span>
          {t("stepOf", {
            current: step + 1,
            total: STEP_ICONS.length,
            pct: progressPct,
          })}
        </p>
        <h1 className="display-heading mt-3 text-balance text-[clamp(1.7rem,8vw,2.25rem)] leading-[0.95] text-[var(--paper)]">
          {showAi ? t("openingPreview") : t(`steps.${step}`)}
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
          {showAi ? t("aiSubtext") : stepHint}
        </p>
        <div className="mt-5">{renderProgress()}</div>
      </div>

      <aside className="start-dark style-night relative hidden overflow-hidden px-8 py-12 lg:sticky lg:top-[4.75rem] lg:flex lg:min-h-[calc(100dvh-4.75rem)] lg:flex-col lg:justify-between lg:overflow-y-auto">
        <div className="start-orb" aria-hidden />
        <div className="relative z-10">
          <p className="start-kicker flex items-center gap-3 text-primary">
            <span aria-hidden>{String(step + 1).padStart(2, "0")}</span>
            {t("onboardingEyebrow")}
          </p>
          <h1 className="display-heading mt-4 max-w-[11ch] text-balance text-5xl leading-[0.9] text-[var(--paper)]">
            {showAi ? t("openingPreview") : t(`steps.${step}`)}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            {showAi ? t("aiSubtext") : stepHint}
          </p>
        </div>
        <div className="relative z-10 mt-10">
          <nav aria-label={t("stepProgressLabel")} className="border-t border-white/15">
            {STEP_ICONS.map((_, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!done || showAi}
                  onClick={() => {
                    setError("");
                    setStep(i);
                  }}
                  className={cn(
                    "grid w-full grid-cols-[2.5rem_1fr] gap-3 border-b border-white/15 py-2.5 text-left text-sm",
                    current
                      ? "text-[var(--paper)]"
                      : done
                        ? "text-white/70 hover:text-[var(--paper)]"
                        : "text-white/30"
                  )}
                >
                  <span className="text-[11px] font-bold tracking-[0.16em] text-white/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t(`steps.${i}`)}
                </button>
              );
            })}
          </nav>
          <div className="mt-6">{renderProgress()}</div>
          {draftSaved ? (
            <p className="mt-4 text-[11px] font-medium text-primary">{t("draftSaved")}</p>
          ) : null}
        </div>
      </aside>

      <div className="style-paper relative bg-[#fffbf6]">
        {showAi ? (
          <div className="flex min-h-[20rem] items-center px-5 py-16 md:px-10">
            <AiLoader complete={navigatingToPreview} completeLabel={t("openingPreview")} />
          </div>
        ) : (
          <>
            {error ? (
              <p className="border-b border-red/30 bg-red/10 px-5 py-3 text-sm text-red md:px-8" role="alert">
                {error}
              </p>
            ) : null}
            {draftSaved ? (
              <p className="border-b border-foreground/10 px-5 py-2 text-xs text-primary lg:hidden md:px-8">
                {t("draftSaved")}
              </p>
            ) : null}
            <div className="pb-[calc(7.25rem+env(safe-area-inset-bottom))] lg:pb-8">
            <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="s0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="start-cell border-x-0">
              <p className="start-kicker">02</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/85 md:text-base">
                {t("welcomeBody")}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
                {t("menOnlyNote")}
              </p>
            </div>
            <ol className="start-grid">
              {(features.length ? features : [0, 1, 2].map((i) => t(`welcomeBullets.${i}`))).map(
                (line, i) => (
                  <li
                    key={line}
                    className="start-cell grid grid-cols-[2.5rem_1fr] gap-3 border-x-0"
                  >
                    <span className="pillar-num text-[11px] font-bold tracking-[0.2em] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/90">{line}</span>
                  </li>
                )
              )}
            </ol>
            <div className="start-cell border-x-0">
              <p className="start-kicker">{t("privacyTitle")}</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{t("privacyBody")}</p>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="start-cell border-x-0">
              <p className="start-kicker">{t("goal")}</p>
            </div>
            {GOAL_CHOICES.map((choice, i) => (
              <StartChoice
                key={choice.labelKey}
                index={i}
                selected={form.goal === choice.value}
                onClick={() => update("goal", choice.value)}
              >
                {t(choice.labelKey)}
              </StartChoice>
            ))}
            <div className="start-cell border-x-0">
              <p className="start-kicker">{t("erectionQuality")}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                {t("hints.erectionQuality")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3" role="group">
                {QUALITY_CHOICES.map((choice) => {
                  const selected = form.erectionQuality === choice.value;
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      onClick={() => update("erectionQuality", choice.value)}
                      className={cn(
                        "start-pill min-h-11 px-4 py-2.5 text-[11px]",
                        selected && "start-pill--invert"
                      )}
                    >
                      {t(choice.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="start-grid grid sm:grid-cols-2"
          >
            <div className="start-cell">
              <label htmlFor="name" className={fieldLabelClass}>
                {t("name")}
              </label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder={t("namePlaceholder")}
                className={cn("mt-4", fieldInputClass)}
              />
              <FieldHint text={t("hints.name")} />
            </div>
            <div className="start-cell">
              <label htmlFor="age" className={fieldLabelClass}>
                {t("age")}
              </label>
              <Input
                id="age"
                type="number"
                min={18}
                max={75}
                value={form.age}
                onChange={(e) => update("age", Number(e.target.value))}
                className={cn("mt-4", fieldInputClass)}
              />
              <FieldHint text={t("hints.age")} />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LiveBmi form={form} />
            <div className="start-grid grid sm:grid-cols-2">
              <div className="start-cell">
                <label htmlFor="weight" className={fieldLabelClass}>{t("weight")}</label>
                <Input
                  id="weight"
                  type="number"
                  min={45}
                  max={180}
                  value={form.weight}
                  onChange={(e) => update("weight", Number(e.target.value))}
                  className={cn("mt-4", fieldInputClass)}
                />
                <FieldHint text={t("hints.weight")} />
              </div>
              <div className="start-cell">
                <label htmlFor="weightUnit" className={fieldLabelClass}>{t("unit")}</label>
                <select
                  id="weightUnit"
                  className={cn("mt-4", selectClass)}
                  value={form.weightUnit}
                  onChange={(e) => update("weightUnit", e.target.value as "kg" | "lb")}
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
              <div className="start-cell sm:col-span-2">
                <label htmlFor="heightUnit" className={fieldLabelClass}>{t("height")}</label>
                <select
                  id="heightUnit"
                  className={cn("mt-4", selectClass)}
                  value={form.heightUnit}
                  onChange={(e) => {
                    const unit = e.target.value as "cm" | "ft";
                    update("heightUnit", unit);
                    if (unit === "ft") {
                      const { feet, inches } = feetInchesFromDecimal(
                        form.heightUnit === "ft" ? form.height : 5.75
                      );
                      syncHeightFromFtIn(feet || 5, inches || 9);
                    } else {
                      update("height", form.height < 100 ? 175 : form.height);
                    }
                  }}
                >
                  <option value="cm">cm</option>
                  <option value="ft">{t("heightFtOption")}</option>
                </select>
                {form.heightUnit === "cm" ? (
                  <Input
                    id="height"
                    type="number"
                    min={150}
                    max={210}
                    value={form.height}
                    onChange={(e) => update("height", Number(e.target.value))}
                    className={cn("mt-6", fieldInputClass)}
                  />
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="heightFeet" className={fieldLabelClass}>{t("heightFeet")}</label>
                      <Input
                        id="heightFeet"
                        type="number"
                        min={4}
                        max={7}
                        value={heightFeet}
                        onChange={(e) => syncHeightFromFtIn(Number(e.target.value), heightInches)}
                        className={cn("mt-4", fieldInputClass)}
                      />
                    </div>
                    <div>
                      <label htmlFor="heightInches" className={fieldLabelClass}>{t("heightInches")}</label>
                      <Input
                        id="heightInches"
                        type="number"
                        min={0}
                        max={11}
                        value={heightInches}
                        onChange={(e) => syncHeightFromFtIn(heightFeet, Number(e.target.value))}
                        className={cn("mt-4", fieldInputClass)}
                      />
                    </div>
                  </div>
                )}
                <FieldHint text={t("hints.height")} />
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="lifestyle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="start-grid grid sm:grid-cols-2"
          >
            <OptionPills
              label={t("activity")}
              hint={t("hints.activity")}
              value={form.activity}
              onChange={(value) => update("activity", value)}
              options={(["sedentary", "light", "moderate", "active"] as const).map((id) => ({
                value: id,
                label: t(`activityLevels.${id}`),
              }))}
            />
            <OptionPills
              label={t("sleepHours")}
              value={form.sleepHours}
              onChange={(value) => update("sleepHours", value)}
              options={(["under_6", "6_7", "7_8", "over_8"] as const).map((id) => ({
                value: id,
                label: t(`sleepOptions.${id}`),
              }))}
            />
            <OptionPills
              label={t("stressLevel")}
              value={form.stressLevel}
              onChange={(value) => update("stressLevel", value)}
              options={(["low", "medium", "high"] as const).map((id) => ({
                value: id,
                label: t(`stressOptions.${id}`),
              }))}
            />
            <OptionPills
              label={t("exerciseMinutes")}
              value={form.exerciseMinutes}
              onChange={(value) => update("exerciseMinutes", value)}
              options={(["under_20", "20_40", "over_40"] as const).map((id) => ({
                value: id,
                label: t(`exerciseTimeOptions.${id}`),
              }))}
            />
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="habits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="start-grid grid sm:grid-cols-2"
          >
            <OptionPills
              label={t("smoking")}
              value={form.smoking ? "yes" : "no"}
              onChange={(value) => update("smoking", value === "yes")}
              options={[
                { value: "no", label: t("smokingNo") },
                { value: "yes", label: t("smokingYes") },
              ]}
            />
            <OptionPills
              label={t("alcohol")}
              value={form.alcohol}
              onChange={(value) => update("alcohol", value)}
              options={(["rarely", "weekly", "daily"] as const).map((id) => ({
                value: id,
                label: t(`alcoholLevels.${id}`),
              }))}
            />
            <div className="sm:col-span-2">
              <OptionPills
                label={t("dietPreference")}
                hint={t("hints.diet")}
                value={form.dietPreference}
                onChange={(value) => update("dietPreference", value)}
                options={(["none", "vegetarian", "vegan"] as const).map((id) => ({
                  value: id,
                  label: t(`dietOptions.${id}`),
                }))}
              />
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="screening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="start-cell border-x-0">
              <p className="start-kicker">{t("lifestyleSections.screening")}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{t("screeningIntro")}</p>
            </div>
            {(
              [
                "none",
                "chest_pain",
                "persistent_ed",
                "new_meds",
                "severe_fatigue",
              ] as const
            ).map((id, i) => {
              const selected = form.redFlags.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleRedFlag(id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-4 border-b border-foreground/10 px-5 py-4 text-left md:px-8",
                    selected ? "bg-primary/10" : "hover:bg-foreground/[0.03]"
                  )}
                >
                  <span className="w-8 shrink-0 text-[11px] font-bold tracking-[0.16em] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-base font-medium leading-snug">
                    {t(`redFlags.${id}`)}
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center border",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-foreground/20 bg-white text-transparent"
                    )}
                    aria-hidden
                  >
                    <AppIcon name="check" size={14} />
                  </span>
                </button>
              );
            })}
            {screeningWarning ? (
              <p className="start-cell border-x-0 text-sm text-warning">
                {t("screeningWarning")}
              </p>
            ) : null}
          </motion.div>
        )}

        {step === 7 && (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="start-cell border-x-0">
              <p className="start-kicker">{t("previewScoreLabel")}</p>
              <p className="display-heading mt-6 text-7xl leading-none text-foreground md:text-8xl">
                {previewScore}
              </p>
              <p className="mt-4 max-w-xl text-sm text-muted">{t("previewScoreHint")}</p>
            </div>
            <div className="start-cell border-x-0">
              <p className="max-w-xl text-sm leading-relaxed text-foreground/85">{t("previewStepBody")}</p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t("previewStepFootnote")}</p>
            </div>
          </motion.div>
        )}
            </AnimatePresence>
            <div className="hidden border-t border-foreground/10 px-5 py-5 lg:block md:px-8">
              {renderNav()}
            </div>
            </div>
            <div className="sticky bottom-0 z-20 border-t border-foreground/10 bg-[var(--paper)]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
              {renderNav()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

