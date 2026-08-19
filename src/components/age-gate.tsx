"use client";

import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const KEY = "vp_age_accepted";

export function AgeGate() {
  const t = useTranslations("ageGate");
  const [show, setShow] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    dialogRef.current?.querySelector("button")?.focus();
  }, [show]);

  if (!show) return null;

  function accept() {
    localStorage.setItem(KEY, "1");
    track("age_gate_accepted");
    setShow(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-body"
    >
      <div ref={dialogRef} className="card-dark max-w-md p-8 text-center">
        <h2 id="age-gate-title" className="display-heading text-2xl text-foreground">
          {t("title")}
        </h2>
        <p id="age-gate-body" className="mt-4 text-sm text-muted">
          {t("body")}
        </p>
        <Button variant="pill" className="mt-8 w-full" size="lg" onClick={accept}>
          {t("accept")}
        </Button>
        <Link
          href="/privacy"
          className="mt-4 inline-block text-sm text-muted underline-offset-2 hover:text-foreground hover:underline"
          onClick={() => setShow(false)}
        >
          {t("decline")}
        </Link>
      </div>
    </div>
  );
}
