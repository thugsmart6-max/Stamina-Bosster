/**
 * Writes data/media-cache.json from newest mtime in public/media.
 * Appends ?v= to image URLs so Next/Image and browsers pick up replacements.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const mediaDir = path.join(root, "public", "media");
const outFile = path.join(root, "data", "media-cache.json");

let version = 0;
if (fs.existsSync(mediaDir)) {
  for (const name of fs.readdirSync(mediaDir)) {
    if (!/\.(jpe?g|png|webp)$/i.test(name)) continue;
    const stat = fs.statSync(path.join(mediaDir, name));
    if (stat.mtimeMs > version) version = Math.floor(stat.mtimeMs);
  }
}

if (version === 0) version = Date.now();

fs.writeFileSync(outFile, JSON.stringify({ version }, null, 2) + "\n");
console.log("Media cache version:", version);

const required = [
  "walk", "swim", "squat", "plank", "stretch", "kegel", "bike", "interval",
  "salmon", "chicken", "eggs", "yogurt", "oats", "greens", "berries", "nuts",
  "soda", "alcohol", "fried", "late_meal",
];
const mediaJson = JSON.parse(
  fs.readFileSync(path.join(root, "data", "media.json"), "utf8")
);
const missing = required.filter((key) => {
  const url = mediaJson[key]?.url?.replace(/^\//, "") ?? "";
  return url && !fs.existsSync(path.join(root, "public", url));
});
if (missing.length) {
  console.warn("Missing files for keys:", missing.join(", "));
}
