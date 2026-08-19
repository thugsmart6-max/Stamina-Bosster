import { put } from "@vercel/blob";
import { getOrder, saveOrder } from "./session-store";
import type { OrderRecord } from "./types";

export async function persistOrderPdf(
  orderId: string,
  pdf: Buffer
): Promise<string | undefined> {
  const order = getOrder(orderId);
  if (!order) return undefined;

  order.pdfBuffer = pdf;

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

  saveOrder(order);
  return order.blobUrl;
}

export function getOrderPdf(orderId: string): Buffer | undefined {
  const order = getOrder(orderId);
  return order?.pdfBuffer;
}

export function getOrderBlobUrl(orderId: string): string | undefined {
  return getOrder(orderId)?.blobUrl;
}

export function createOrderRecord(
  orderId: string,
  sessionId: string,
  name: string,
  email?: string
): OrderRecord {
  return {
    orderId,
    sessionId,
    name,
    email,
    createdAt: new Date().toISOString(),
  };
}
