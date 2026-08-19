export const CHECKOUT_PRICE_INR = 799;
export const LIST_PRICE_INR = 3999;
export const OFFER_DURATION_MS = 10 * 60 * 1000;
export const SPIN_SEQUENCE = [80, 30, 10] as const;
export const MAX_SPINS = 3;

/** @deprecated Use CHECKOUT_PRICE_INR — kept for existing imports */
export const BASE_PRICE_INR = CHECKOUT_PRICE_INR;

export type PromoOffer = {
  discountPercent: number;
  expiresAt: number;
  spunAt: number;
  spinCount: number;
};

export type SpinState = {
  spinCount: number;
  lastDiscount: number | null;
  exhausted: boolean;
  offer: PromoOffer | null;
};

const OFFER_STORAGE_KEY = "vp_promo_offer";

export function spinStorageKey(userId: string): string {
  return `vp_spin_state_${userId}`;
}

export function discountForSpin(spinNumber: number): number | null {
  if (spinNumber < 1 || spinNumber > MAX_SPINS) return null;
  return SPIN_SEQUENCE[spinNumber - 1] ?? null;
}

export function createOffer(
  discountPercent: number,
  spinCount: number
): PromoOffer {
  const spunAt = Date.now();
  return {
    discountPercent,
    expiresAt: spunAt + OFFER_DURATION_MS,
    spunAt,
    spinCount,
  };
}

export function loadSpinState(userId: string): SpinState {
  const empty: SpinState = {
    spinCount: 0,
    lastDiscount: null,
    exhausted: false,
    offer: null,
  };
  if (!userId) return empty;

  try {
    const raw = localStorage.getItem(spinStorageKey(userId));
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<SpinState>;
    const spinCount =
      typeof parsed.spinCount === "number"
        ? Math.min(MAX_SPINS, Math.max(0, parsed.spinCount))
        : 0;
    const offer = loadPromoOffer();
    return {
      spinCount,
      lastDiscount:
        typeof parsed.lastDiscount === "number" ? parsed.lastDiscount : null,
      exhausted: spinCount >= MAX_SPINS,
      offer,
    };
  } catch {
    return empty;
  }
}

export function saveSpinState(
  userId: string,
  state: Pick<SpinState, "spinCount" | "lastDiscount">
): void {
  if (!userId) return;
  try {
    localStorage.setItem(
      spinStorageKey(userId),
      JSON.stringify({
        spinCount: state.spinCount,
        lastDiscount: state.lastDiscount,
      })
    );
  } catch {
    /* ignore */
  }
}

export function savePromoOffer(offer: PromoOffer): void {
  try {
    sessionStorage.setItem(OFFER_STORAGE_KEY, JSON.stringify(offer));
  } catch {
    /* ignore */
  }
}

export function loadPromoOffer(): PromoOffer | null {
  try {
    const raw = sessionStorage.getItem(OFFER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PromoOffer;
    if (
      typeof parsed.discountPercent !== "number" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPromoOffer(): void {
  try {
    sessionStorage.removeItem(OFFER_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function isPromoOfferActive(
  offer: PromoOffer | null,
  now = Date.now()
): boolean {
  if (!offer) return false;
  return offer.expiresAt > now;
}

export function checkoutPriceInr(): number {
  return CHECKOUT_PRICE_INR;
}

/** @deprecated Use checkoutPriceInr — checkout is always ₹799 after spinning */
export function discountedPriceInr(_discountPercent?: number): number {
  return CHECKOUT_PRICE_INR;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function remainingMs(offer: PromoOffer, now = Date.now()): number {
  return Math.max(0, offer.expiresAt - now);
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const FRESH_SIGNUP_KEY = "vp_fresh_signup";

export function isFreshSignupSession(): boolean {
  try {
    return sessionStorage.getItem(FRESH_SIGNUP_KEY) === "1";
  } catch {
    return false;
  }
}

export function markFreshSignupSession(): void {
  try {
    sessionStorage.setItem(FRESH_SIGNUP_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearFreshSignupSession(): void {
  try {
    sessionStorage.removeItem(FRESH_SIGNUP_KEY);
  } catch {
    /* ignore */
  }
}
