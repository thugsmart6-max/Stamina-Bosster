import mediaCache from "../../data/media-cache.json";
import mediaData from "../../data/media.json";
import path from "path";

export type MediaKey = keyof typeof mediaData;

export function getMediaUrl(imageKey: string) {
  const m = mediaData[imageKey as MediaKey];
  const base = m?.url ?? "";
  const v = mediaCache.version;
  return v ? `${base}?v=${v}` : base;
}

/** Project-relative path for @react-pdf/renderer Image src (Windows-safe). */
export function getMediaPathForPdf(imageKey: string) {
  const m = mediaData[imageKey as MediaKey];
  const base = (m?.url ?? "").split("?")[0];
  if (!base) return "";
  if (base.startsWith("/")) {
    return path
      .join("public", base.replace(/^\//, ""))
      .replace(/\\/g, "/");
  }
  return base;
}

/** Production launch uses preview checkout only — no Stripe, no live charge. */
export function isDemoPaymentMode() {
  return true;
}

export function isDemoCheckoutEnabled() {
  return true;
}

/** Stripe Checkout is disabled for this launch. */
export function isStripeEnabled() {
  return false;
}
