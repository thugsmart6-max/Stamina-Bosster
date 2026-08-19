# Payments (developer)

v1 uses `PAYMENT_MODE=demo` and [`src/lib/payments/demo-provider.ts`](../src/lib/payments/demo-provider.ts).

## Adding a real gateway later

1. Implement `PaymentProvider` in `src/lib/payments/`.
2. Register it in `src/lib/payments/index.ts` when `PAYMENT_MODE` matches.
3. Do **not** expose vendor names in user-facing UI strings.

User copy should remain generic: “Complete purchase”, not vendor-branded buttons.
