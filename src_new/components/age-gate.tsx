"use client";

import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const KEY = "vp_age_accepted";

export function AgeGate() {
  const t = useTranslations("ageGate");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  if (!show) return null;

  function accept() {
    localStorage.setItem(KEY, "1");
    track("age_gate_accepted");
    setShow(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="card-dark max-w-md p-8 text-center">
        <h2 className="display-heading text-2xl text-white">{t("title")}</h2>
        <p className="mt-4 text-sm text-muted">{t("body")}</p>
        <Button variant="pill" className="mt-8 w-full" size="lg" onClick={accept}>
          {t("accept")}
        </Button>
      </div>
    </div>
  );
}
