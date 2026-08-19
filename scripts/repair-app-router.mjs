/**
 * Repairs dev EPERM: syncs a clean App Router tree to ./app (root).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    if (fs.statSync(from).isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
  return true;
}

function mergeRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    if (fs.statSync(from).isDirectory()) mergeRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
  return true;
}

const srcNewApp = path.join(root, "src_new", "app");
const destApp = path.join(root, "app");

let source = srcNewApp;
if (!fs.existsSync(path.join(srcNewApp, "[locale]", "layout.tsx"))) {
  source = null;
}

if (source) {
  fs.mkdirSync(destApp, { recursive: true });
  for (const name of fs.readdirSync(source)) {
    if (name === "preview" || name === "success") continue;
    const from = path.join(source, name);
    const to = path.join(destApp, name);
    if (fs.statSync(from).isDirectory()) {
      mergeRecursive(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

const stale = ["page.tsx", "layout.tsx", "globals.css"];
for (const f of stale) {
  const p = path.join(root, "src", "app", f);
  try {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  } catch {
    /* ignore */
  }
}

for (const g of ["preview", "success"]) {
  const p = path.join(root, "src", "app", g);
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

console.log("App router repair finished. Root app:", destApp);
