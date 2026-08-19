import { locales, type Locale } from "@/i18n/routing";
import { requireVerifiedAuth } from "@/lib/auth/guards";
import { generateFullReportPdf } from "@/lib/pdf/generate";
import { getOrder, getSession } from "@/lib/session-store";
import { getOrderPdf } from "@/lib/storage";
import { NextResponse } from "next/server";

function parseLocale(value: string | null): Locale {
  if (value && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return "en";
}

function pdfResponse(pdf: Buffer, filename: string) {
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const auth = await requireVerifiedAuth(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!order.userId || order.userId !== auth.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const locale = parseLocale(searchParams.get("locale"));
  const filename = `vitalitypath-report-${locale}-${orderId.slice(0, 8)}.pdf`;

  const sessionId = order.planSessionId ?? order.sessionId;
  const session = sessionId ? await getSession(sessionId) : undefined;

  if (session) {
    try {
      const pdf = await generateFullReportPdf({
        intake: session.intake,
        plan: session.plan,
        locale,
        orderId,
      });

      return pdfResponse(pdf, filename);
    } catch (e) {
      console.error("PDF generation failed", e);
      const message =
        e instanceof Error && e.message.includes("PDF fonts missing")
          ? "PDF fonts are not installed on the server. Run node scripts/ensure-pdf-fonts.mjs"
          : "PDF generation failed for this language. Try again in a moment.";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (locale !== "en") {
    return NextResponse.json(
      {
        error:
          "Your session expired — Hindi/Tamil PDF must be generated fresh. Complete checkout again or open the report from your dashboard.",
      },
      { status: 410 }
    );
  }

  const pdf = await getOrderPdf(orderId);
  if (!pdf) {
    return NextResponse.json({ error: "PDF not available" }, { status: 404 });
  }

  return pdfResponse(pdf, filename);
}
