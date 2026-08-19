import Stripe from "stripe";
import type { CheckoutInput, CheckoutResult, PaymentProvider } from "./types";

export class StripePaymentProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY missing");
    this.stripe = new Stripe(key);
  }

  async confirmPayment(_input: CheckoutInput): Promise<CheckoutResult> {
    return {
      success: false,
      error: "Use Stripe Checkout — call /api/checkout/stripe",
    };
  }

  async createCheckoutSession(
    sessionId: string,
    options?: { email?: string; userId?: string }
  ) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) throw new Error("STRIPE_PRICE_ID missing");

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: options?.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
      metadata: {
        vp_session: sessionId,
        vp_plan_session: sessionId,
        ...(options?.userId ? { vp_user: options.userId } : {}),
      },
    });

    return { url: session.url, sessionId: session.id };
  }
}
