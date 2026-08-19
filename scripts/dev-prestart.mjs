/**
 * Clears stale Next dev lock and owning PID before `next dev`.
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lockPath = path.join(root, ".next", "dev", "lock");

function killPid(pid) {
  if (!pid || pid <= 0) return false;
  try {
    process.kill(pid, 0);
  } catch {
    return false;
  }
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    } else {
      process.kill(pid, "SIGKILL");
    }
    return true;
  } catch {
    return false;
  }
}

function killPorts() {
  if (process.platform !== "win32") return;
  for (const port of [3000, 3001, 3002, 3003]) {
    try {
      const out = execSync(
        `powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue).OwningProcess | Select-Object -Unique"`,
        { encoding: "utf8" }
      );
      const pids = out
        .split(/\r?\n/)
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => n > 0);
      for (const pid of pids) killPid(pid);
    } catch {
      /* no listener */
    }
  }
}

if (fs.existsSync(lockPath)) {
  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    killPid(lock.pid);
  } catch {
    /* ignore */
  }
  try {
    fs.unlinkSync(lockPath);
  } catch {
    /* ignore */
  }
}

killPorts();
console.log("Dev prestart: cleared lock and stale processes.");
