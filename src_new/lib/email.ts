import { Resend } from "resend";

export async function sendOrderEmail({
  to,
  name,
  orderId,
}: {
  to: string;
  name: string;
  orderId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Stamina Booster <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const downloadUrl = `${appUrl}/api/download/${orderId}`;

  if (!apiKey) {
    console.log("[email skipped] RESEND_API_KEY not set", { to, downloadUrl });
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to,
    subject: `${name}, your Stamina Booster plan is ready`,
    html: `
      <h1>Your plan is ready</h1>
      <p>Hi ${name},</p>
      <p>Thank you for your purchase. Download your personalized wellness PDF:</p>
      <p><a href="${downloadUrl}">Download your plan (PDF)</a></p>
      <p>You can also visit: ${appUrl}/success/${orderId}</p>
      <p style="color:#666;font-size:12px;">Educational content only — not medical advice.</p>
    `,
  });
}
