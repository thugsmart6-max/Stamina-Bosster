import fs from "node:fs";
import path from "node:path";
import { Font } from "@react-pdf/renderer";
import type { Locale } from "@/i18n/routing";

let registered = false;

const REQUIRED_FONTS = [
  "NotoSans-Regular.ttf",
  "NotoSans-Bold.ttf",
  "NotoSansDevanagari-Regular.ttf",
  "NotoSansDevanagari-Bold.ttf",
  "NotoSansTamil-Regular.ttf",
  "NotoSansTamil-Bold.ttf",
] as const;

function fontFile(name: string) {
  return path.join(process.cwd(), "public", "fonts", "pdf", name);
}

function hasSpaceGrotesk() {
  return (
    fs.existsSync(fontFile("SpaceGrotesk-Regular.ttf")) &&
    fs.existsSync(fontFile("SpaceGrotesk-Medium.ttf"))
  );
}

export function assertPdfFontsPresent() {
  const missing = REQUIRED_FONTS.filter((name) => !fs.existsSync(fontFile(name)));
  if (missing.length > 0) {
    throw new Error(
      `PDF fonts missing (${missing.join(", ")}). Run: node scripts/ensure-pdf-fonts.mjs`
    );
  }
}

export function registerPdfFonts() {
  if (registered) return;
  assertPdfFontsPresent();
  registered = true;

  Font.registerHyphenationCallback((word) => [word]);

  Font.register({
    family: "NotoSans",
    fonts: [
      { src: fontFile("NotoSans-Regular.ttf"), fontWeight: 400 },
      { src: fontFile("NotoSans-Bold.ttf"), fontWeight: 700 },
    ],
  });

  Font.register({
    family: "NotoDevanagari",
    fonts: [
      { src: fontFile("NotoSansDevanagari-Regular.ttf"), fontWeight: 400 },
      { src: fontFile("NotoSansDevanagari-Bold.ttf"), fontWeight: 700 },
    ],
  });

  Font.register({
    family: "NotoTamil",
    fonts: [
      { src: fontFile("NotoSansTamil-Regular.ttf"), fontWeight: 400 },
      { src: fontFile("NotoSansTamil-Bold.ttf"), fontWeight: 700 },
    ],
  });

  if (hasSpaceGrotesk()) {
    const spaceFonts = [
      { src: fontFile("SpaceGrotesk-Regular.ttf"), fontWeight: 400 },
      { src: fontFile("SpaceGrotesk-Medium.ttf"), fontWeight: 500 },
    ];
    if (fs.existsSync(fontFile("SpaceGrotesk-Bold.ttf"))) {
      spaceFonts.push({
        src: fontFile("SpaceGrotesk-Bold.ttf"),
        fontWeight: 700,
      });
    }
    Font.register({ family: "SpaceGrotesk", fonts: spaceFonts });
  }
}

/** Per-locale PDF fonts: Latin, Devanagari (Hindi), or Tamil script. */
export function getPdfFontFamily(locale: Locale): string {
  if (locale === "ta") return "NotoTamil";
  if (locale === "hi") return "NotoDevanagari";
  return hasSpaceGrotesk() ? "SpaceGrotesk" : "NotoSans";
}

export function pdfUsesIndicScript(locale: Locale): boolean {
  return locale === "ta" || locale === "hi";
}
