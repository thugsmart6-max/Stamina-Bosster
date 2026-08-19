import { v4 as uuidv4 } from "uuid";
import type { CheckoutInput, CheckoutResult, PaymentProvider } from "./types";

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export class DemoPaymentProvider implements PaymentProvider {
  async confirmPayment(input: CheckoutInput): Promise<CheckoutResult> {
    await delay(1500);

    const card = input.cardNumber.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(card)) {
      return { success: false, error: "Invalid card number format" };
    }
    if (!luhnCheck(card)) {
      return { success: false, error: "Card number failed validation" };
    }
    if (!/^\d{2}\/\d{2}$/.test(input.expiry.trim())) {
      return { success: false, error: "Expiry must be MM/YY" };
    }
    if (!/^\d{3,4}$/.test(input.cvc)) {
      return { success: false, error: "Invalid CVC" };
    }
    if (input.nameOnCard.trim().length < 2) {
      return { success: false, error: "Name on card is required" };
    }

    return { success: true, orderId: uuidv4() };
  }
}
