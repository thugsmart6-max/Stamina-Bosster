import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONT_DIR = path.join(ROOT, "public", "fonts", "pdf");

const FONTS = [
  {
    name: "NotoSans-Regular.ttf",
    url: "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
  },
  {
    name: "NotoSans-Bold.ttf",
    url: "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf",
  },
  {
    name: "NotoSansDevanagari-Regular.ttf",
    url: "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf",
  },
  {
    name: "NotoSansDevanagari-Bold.ttf",
    url: "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Bold.ttf",
  },
  {
    name: "NotoSansTamil-Regular.ttf",
    url: "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansTamil/NotoSansTamil-Regular.ttf",
  },
  {
    name: "NotoSansTamil-Bold.ttf",
    url: "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansTamil/NotoSansTamil-Bold.ttf",
  },
  {
    name: "SpaceGrotesk-Regular.ttf",
    url: "https://github.com/floriankarsten/space-grotesk/raw/master/fonts/ttf/static/SpaceGrotesk-Regular.ttf",
    optional: true,
  },
  {
    name: "SpaceGrotesk-Medium.ttf",
    url: "https://github.com/floriankarsten/space-grotesk/raw/master/fonts/ttf/static/SpaceGrotesk-Medium.ttf",
    optional: true,
  },
  {
    name: "SpaceGrotesk-Bold.ttf",
    url: "https://github.com/floriankarsten/space-grotesk/raw/master/fonts/ttf/static/SpaceGrotesk-Bold.ttf",
    optional: true,
  },
];

async function ensureFont({ name, url, optional }) {
  const dest = path.join(FONT_DIR, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 10_000) {
    return;
  }
  console.log(`Downloading PDF font: ${name}`);
  const res = await fetch(url);
  if (!res.ok) {
    if (optional) {
      console.warn(`Skipped optional font ${name} (${res.status})`);
      return;
    }
    throw new Error(`Failed to download ${name} (${res.status})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(FONT_DIR, { recursive: true });
  fs.writeFileSync(dest, buf);
}

await fs.promises.mkdir(FONT_DIR, { recursive: true });
for (const font of FONTS) {
  await ensureFont(font);
}
console.log("PDF fonts ready:", FONT_DIR);
