import { put } from "@vercel/blob";
import {
  getOrder,
  getOrderPdfBuffer,
  saveOrder,
  setOrderPdfBuffer,
} from "./session-store";
import type { OrderRecord } from "./types";

export async function persistOrderPdf(
  orderId: string,
  pdf: Buffer
): Promise<string | undefined> {
  const order = await getOrder(orderId);
  if (!order) return undefined;

  order.pdfBuffer = pdf;
  setOrderPdfBuffer(orderId, pdf);

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    try {
      const blob = await put(`reports/${orderId}.pdf`, pdf, {
        access: "public",
        contentType: "application/pdf",
        token,
      });
      order.blobUrl = blob.url;
    } catch (e) {
      console.error("Blob upload failed, using in-memory store", e);
    }
  }

  await saveOrder(order);
  return order.blobUrl;
}

export async function getOrderPdf(orderId: string): Promise<Buffer | undefined> {
  const cached = getOrderPdfBuffer(orderId);
  if (cached) return cached;
  const order = await getOrder(orderId);
  if (order?.pdfBuffer) return order.pdfBuffer;
  if (order?.blobUrl) {
    try {
      const res = await fetch(order.blobUrl);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        setOrderPdfBuffer(orderId, buf);
        return buf;
      }
    } catch {
      /* fall through */
    }
  }
  return undefined;
}

export async function getOrderBlobUrl(
  orderId: string
): Promise<string | undefined> {
  const order = await getOrder(orderId);
  return order?.blobUrl;
}

export function createOrderRecord(input: {
  orderId: string;
  sessionId: string;
  planSessionId: string;
  userId: string;
  stripeSessionId?: string;
  name: string;
  email?: string;
  status?: OrderRecord["status"];
}): OrderRecord {
  return {
    orderId: input.orderId,
    sessionId: input.sessionId,
    planSessionId: input.planSessionId,
    userId: input.userId,
    stripeSessionId: input.stripeSessionId,
    name: input.name,
    email: input.email,
    status: input.status ?? "paid",
    createdAt: new Date().toISOString(),
  };
}
