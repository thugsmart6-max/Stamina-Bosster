export interface CheckoutInput {
  sessionId: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  nameOnCard: string;
}

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export interface PaymentProvider {
  confirmPayment(input: CheckoutInput): Promise<CheckoutResult>;
}
