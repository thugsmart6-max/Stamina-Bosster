import type { Locale } from "@/i18n/routing";

/** Words that crash fontkit GPOS when rendered with Noto Devanagari in react-pdf. */
const WORD_REPLACEMENTS: [RegExp, string][] = [
  [/इरेक्शन/g, "उत्तेजना"],
  [/थेरेपी/g, "चिकित्सा"],
  [/कार्रवाई/g, "कार्यवाही"],
  [/पारंपरिक/g, "पारम्परिक"],
];

/**
 * Patch Hindi strings so @react-pdf/fontkit can shape them with Noto Devanagari.
 * Without this, some conjuncts/endings trigger GPOS anchor errors; without
 * Devanagari fonts, Hindi renders as Latin tofu instead of देवनागरी.
 */
export function sanitizeHindiPdfText(text: string): string {
  let out = String(text ?? "");
  for (const [pattern, replacement] of WORD_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  // "करें", "सुधारें", "रहें" — ra + vowel sign + anusvara ligature bug
  out = out.replace(/([\u0900-\u097F])ें/g, "$1 ें");
  // "पूरे", "मैकरेल" — ra + e matra without anusvara
  out = out.replace(/([\u0900-\u097F])र\u0947(?!\u0902)/g, "$1र \u0947");
  // "कूल्हे" — ha + e matra without anusvara
  out = out.replace(/([\u0900-\u097F])ह\u0947(?!\u0902)/g, "$1ह \u0947");
  // Standalone "है" (not "हैं") — ha + ai matra bug
  out = out.replace(/\u0939\u0948(?!\u0902)/g, "ह ै");
  return out;
}

export function pdfText(text: string | number | null | undefined, locale: Locale): string {
  if (locale !== "hi") return String(text ?? "");
  return sanitizeHindiPdfText(String(text ?? ""));
}
