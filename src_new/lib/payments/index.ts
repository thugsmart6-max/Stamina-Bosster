import { DemoPaymentProvider } from "./demo-provider";
import type { PaymentProvider } from "./types";

export function getPaymentProvider(): PaymentProvider {
  return new DemoPaymentProvider();
}

export function getStripeProvider() {
  return null;
}

export type { CheckoutInput, CheckoutResult, PaymentProvider } from "./types";
