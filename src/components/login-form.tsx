"use client";

import { AuthAlert } from "@/components/auth-alert";
import { AuthFormField } from "@/components/auth-form-field";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { InputWithIcon } from "@/components/input-with-icon";
import { PasswordVisibilityToggle } from "@/components/password-visibility-toggle";
import {
  clearRememberedEmail,
  getRememberedEmail,
  setRememberedEmail,
} from "@/lib/auth-remember";
import { clearFreshSignupSession } from "@/lib/promo-offer";
import { Link, useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SubmitState = "idle" | "loading" | "success";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/start";

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginSchema = z.object({
    login: z
      .string()
      .min(1, t("errors.fieldRequired"))
      .email(t("errors.invalidEmail")),
    password: z
      .string()
      .min(1, t("errors.fieldRequired"))
      .min(8, t("errors.passwordTooShort")),
  });

  type LoginValues = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  useEffect(() => {
    const email = getRememberedEmail();
    if (!email) return;
    setRememberMe(true);
    setValue("login", email);
  }, [setValue]);

  async function onSubmit(values: LoginValues) {
    setServerError("");
    setSubmitState("loading");

    if (rememberMe) {
      setRememberedEmail(values.login);
    } else {
      clearRememberedEmail();
    }

    try {
      const loginUrl = new URL("/api/auth/login", window.location.origin).href;
      const loginInit: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };
      let res = await fetch(loginUrl, loginInit);
      let ct = res.headers.get("content-type") ?? "";
      if (res.status === 404 && ct.includes("text/html")) {
        res = await fetch(loginUrl, loginInit);
        ct = res.headers.get("content-type") ?? "";
      }
      let data: {
        error?: string;
        redirectTo?: string;
      } = {};
      if (ct.includes("application/json")) {
        try {
          data = (await res.json()) as typeof data;
        } catch {
          data = { error: t("errors.network") };
        }
      } else {
        await res.text().catch(() => {});
        data = { error: t("errors.login") };
      }
      if (!res.ok) {
        setServerError(data.error ?? t("errors.login"));
        setSubmitState("idle");
        return;
      }
      clearFreshSignupSession();
      const destination =
        next === "/start" && data.redirectTo ? data.redirectTo : next;
      setSubmitState("success");
      window.setTimeout(() => router.push(destination), 700);
    } catch {
      setServerError(t("errors.network"));
      setSubmitState("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <AuthFormField
        id="login"
        label={t("email")}
        icon="email"
        type="email"
        autoComplete="email"
        placeholder={t("loginEmailPlaceholder")}
        error={errors.login?.message}
        {...register("login")}
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium leading-none text-foreground/85"
        >
          {t("password")}
        </label>
        <InputWithIcon
          id="password"
          icon="lock"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          hasError={Boolean(errors.password)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
          trailing={
            <PasswordVisibilityToggle
              visible={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              labelShow={t("showPassword")}
              labelHide={t("hidePassword")}
            />
          }
        />
        {errors.password ? (
          <p
            id="password-error"
            role="alert"
            className="text-sm leading-snug text-red/85"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-accent underline-offset-2 hover:text-accent-light hover:underline"
        >
          {t("forgotPasswordLink")}
        </Link>
      </div>

      <label className="inline-flex w-fit cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 shrink-0 rounded border-foreground/20 bg-white accent-primary focus-visible:ring-2 focus-visible:ring-accent/45"
        />
        <span className="text-sm text-foreground/85">{t("rememberMe")}</span>
      </label>

      {serverError ? <AuthAlert message={serverError} variant="error" /> : null}
      {submitState === "success" ? (
        <AuthAlert message={t("loginSuccess")} variant="success" />
      ) : null}

      <AuthSubmitButton
        idleLabel={t("login")}
        loadingLabel={t("loggingIn")}
        successLabel={t("loginSuccess")}
        icon="lock"
        state={submitState}
      />

      <p className="text-center text-sm text-muted">
        {t("noAccount")}{" "}
        <Link
          href="/signup"
          className="font-semibold text-accent underline-offset-2 hover:text-accent-light hover:underline"
        >
          {t("signup")}
        </Link>
      </p>
    </form>
  );
}
