import type { Locale } from "@/i18n/routing";

export async function downloadReportPdf(
  orderId: string,
  locale: Locale
): Promise<{ ok: true } | { ok: false; message: string }> {
  const url = `/api/download/${orderId}?locale=${locale}`;

  let response: Response;
  try {
    response = await fetch(url, { credentials: "include" });
  } catch {
    return { ok: false, message: "Network error — check your connection and try again." };
  }

  const contentType = response.headers.get("Content-Type") ?? "";

  if (!response.ok) {
    if (contentType.includes("application/json")) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      return {
        ok: false,
        message: body.error ?? `Download failed (${response.status}).`,
      };
    }
    return {
      ok: false,
      message: `Download failed (${response.status}). Please sign in and try again.`,
    };
  }

  if (!contentType.includes("application/pdf")) {
    return {
      ok: false,
      message: "Server did not return a PDF file. Please refresh and try again.",
    };
  }

  const blob = await response.blob();
  const header = new Uint8Array(await blob.slice(0, 5).arrayBuffer());
  const magic = String.fromCharCode(...header);
  if (!magic.startsWith("%PDF")) {
    return { ok: false, message: "Invalid PDF received. Please try again or contact support." };
  }

  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename=\"?([^\";\n]+)\"?/i);
  const filename =
    match?.[1] ??
    `vitalitypath-report-${locale}-${orderId.slice(0, 8)}.pdf`;

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);

  return { ok: true };
}
