const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "10minutemail.com",
  "trashmail.com",
]);

/** RFC 5322–inspired pattern; blocks obvious typos and invalid local parts. */
const EMAIL_FORMAT =
  /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmailFormat(email: string): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized || normalized.length > 254) return false;
  if (!EMAIL_FORMAT.test(normalized)) return false;

  const [local, domain] = normalized.split("@");
  if (!local || !domain) return false;
  if (local.includes("..") || domain.includes("..")) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return false;

  const labels = domain.split(".");
  const tld = labels.at(-1);
  if (!tld || tld.length < 2) return false;

  return labels.every((label) => label.length > 0 && label.length <= 63);
}

export function getEmailFormatError(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!isValidEmailFormat(email)) {
    return "Enter a valid email address (e.g. name@gmail.com)";
  }
  const domain = normalizeEmail(email).split("@")[1];
  if (domain && DISPOSABLE_DOMAINS.has(domain)) {
    return "Disposable email addresses are not allowed";
  }
  return null;
}
