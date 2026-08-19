import { requireIntakeCompletePage } from "@/lib/auth/funnel-guard";
import { CheckoutForm } from "@/components/checkout-form";
import { isDemoCheckoutEnabled } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await requireIntakeCompletePage(locale as Locale, "/checkout");

  return (
    <CheckoutForm
      demoEnabled={isDemoCheckoutEnabled()}
      defaultEmail={user.email}
    />
  );
}
