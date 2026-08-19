const REMEMBER_KEY = "vp_remember_email";

export function getRememberedEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setRememberedEmail(email: string): void {
  if (typeof window === "undefined") return;
  try {
    if (email.trim()) {
      localStorage.setItem(REMEMBER_KEY, email.trim());
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  } catch {
    /* ignore storage errors */
  }
}

export function clearRememberedEmail(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* ignore storage errors */
  }
}
