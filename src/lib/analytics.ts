export type AnalyticsEvent =
  | "intake_started"
  | "intake_completed"
  | "intake_updated"
  | "preview_viewed"
  | "checkout_started"
  | "purchase_completed"
  | "age_gate_accepted";

export function track(event: AnalyticsEvent, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, props, ts: Date.now() }),
    });
  } catch {
    /* ignore */
  }
}
