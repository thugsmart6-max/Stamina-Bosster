"use client";

import { AuthAlert } from "@/components/auth-alert";
import { AuthFormField } from "@/components/auth-form-field";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator";
import { PasswordVisibilityToggle } from "@/components/password-visibility-toggle";
import { markFreshSignupSession } from "@/lib/promo-offer";
import { Link, useRouter } from "@/i18n/navigation";
import { isValidEmailFormat } from "@/lib/email-format";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

type SubmitState = "idle" | "loading" | "success";

export function SignupForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const termsId = useId();
  const searchParams = useSearchParams();
  const emailFromFooter = searchParams.get("email") ?? "";

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signupSchema = z
    .object({
      fullName: z
        .string()
        .min(1, t("errors.fieldRequired"))
        .min(2, t("errors.nameTooShort"))
        .max(80),
      email: z
        .string()
        .min(1, t("errors.fieldRequired"))
        .refine((value) => isValidEmailFormat(value), t("errors.invalidEmail")),
      password: z
        .string()
        .min(1, t("errors.fieldRequired"))
        .min(8, t("errors.passwordTooShort"))
        .max(128),
      confirmPassword: z.string().min(1, t("errors.fieldRequired")),
      acceptedTerms: z.boolean().refine((value) => value, t("errors.termsRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("errors.passwordMatch"),
      path: ["confirmPassword"],
    });

  type SignupValues = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: emailFromFooter,
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";

  async function onSubmit(values: SignupValues) {
    setServerError("");
    setSubmitState("loading");

    try {
      const signupUrl = new URL("/api/auth/signup", window.location.origin).href;
      const signupInit: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          locale,
        }),
      };
      let res = await fetch(signupUrl, signupInit);
      let ct = res.headers.get("content-type") ?? "";
      if (res.status === 404 && ct.includes("text/html")) {
        res = await fetch(signupUrl, signupInit);
        ct = res.headers.get("content-type") ?? "";
      }
      let data: { error?: string; details?: unknown; user?: unknown } = {};
      if (ct.includes("application/json")) {
        try {
          data = (await res.json()) as typeof data;
        } catch {
          data = { error: t("errors.network") };
        }
      } else {
        await res.text().catch(() => {});
        data = { error: t("errors.signup") };
      }
      if (!res.ok) {
        setServerError(data.error ?? t("errors.signup"));
        setSubmitState("idle");
        return;
      }
      setSubmitState("success");
      markFreshSignupSession();
      window.setTimeout(() => router.push("/start"), 700);
    } catch {
      setServerError(t("errors.network"));
      setSubmitState("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <AuthFormField
        id="fullName"
        label={t("fullName")}
        icon="intakeBasics"
        autoComplete="name"
        placeholder={t("fullNamePlaceholder")}
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <AuthFormField
        id="email"
        label={t("email")}
        icon="email"
        type="email"
        autoComplete="email"
        placeholder={t("loginEmailPlaceholder")}
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="flex flex-col gap-2">
        <AuthFormField
          id="password"
          label={t("password")}
          icon="lock"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="••••••••"
          hint={!errors.password ? t("passwordHint") : undefined}
          error={errors.password?.message}
          trailing={
            <PasswordVisibilityToggle
              visible={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              labelShow={t("showPassword")}
              labelHide={t("hidePassword")}
            />
          }
          {...register("password")}
        />
        <PasswordStrengthIndicator password={passwordValue} />
      </div>

      <AuthFormField
        id="confirmPassword"
        label={t("confirmPassword")}
        icon="lock"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        trailing={
          <PasswordVisibilityToggle
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            labelShow={t("showPassword")}
            labelHide={t("hidePassword")}
          />
        }
        {...register("confirmPassword")}
      />

      <label
        htmlFor={termsId}
        className={cn(
          "inline-flex w-fit max-w-full cursor-pointer items-start gap-2.5",
          errors.acceptedTerms && "text-red/90"
        )}
      >
        <input
          id={termsId}
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-foreground/20 bg-white accent-primary focus-visible:ring-2 focus-visible:ring-accent/45"
          {...register("acceptedTerms")}
        />
        <span className="text-sm leading-relaxed text-muted">
          {t("termsPrefix")}{" "}
          <Link href="/terms" className="font-semibold text-accent hover:underline">
            {t("termsLink")}
          </Link>{" "}
          {t("termsAnd")}{" "}
          <Link href="/privacy" className="font-semibold text-accent hover:underline">
            {t("privacyLink")}
          </Link>
        </span>
      </label>
      {errors.acceptedTerms ? (
        <p role="alert" className="text-sm text-red/85">
          {errors.acceptedTerms.message}
        </p>
      ) : null}

      {serverError ? <AuthAlert message={serverError} variant="error" /> : null}
      {submitState === "success" ? (
        <AuthAlert message={t("signupSuccess")} variant="success" />
      ) : null}

      <AuthSubmitButton
        idleLabel={t("signup")}
        loadingLabel={t("signingUp")}
        successLabel={t("signupSuccess")}
        icon="sparkles"
        state={submitState}
      />

      <p className="text-center text-sm text-muted">
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-accent underline-offset-2 hover:text-accent-light hover:underline"
        >
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
