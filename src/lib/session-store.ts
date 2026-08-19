import {
  COLLECTIONS,
  type IntakeDraftDocument,
  type OrderDocument,
  type PlanSessionDocument,
} from "@/lib/mongodb/models";
import { getDb, isMongoEnabled } from "@/lib/mongodb/client";
import type { OrderRecord, SessionRecord } from "./types";

export type IntakeDraftRecord = {
  userId: string;
  intake: Record<string, unknown>;
  step: number;
  locale: string;
  updatedAt: string;
};

type MemoryStore = {
  sessions: Map<string, SessionRecord>;
  orders: Map<string, OrderRecord>;
  pdfBuffers: Map<string, Buffer>;
  intakeDrafts: Map<string, IntakeDraftRecord>;
};

const globalKey = "__vitalitypath_session_store__";

function getMemoryStore(): MemoryStore {
  const g = globalThis as typeof globalThis & {
    [key: string]: MemoryStore | undefined;
  };
  if (!g[globalKey]) {
    g[globalKey] = {
      sessions: new Map(),
      orders: new Map(),
      pdfBuffers: new Map(),
      intakeDrafts: new Map(),
    };
  }
  return g[globalKey];
}

export async function saveSession(record: SessionRecord): Promise<void> {
  getMemoryStore().sessions.set(record.sessionId, record);

  if (!isMongoEnabled() || !record.userId) return;

  const db = await getDb();
  await db.collection<PlanSessionDocument>(COLLECTIONS.planSessions).updateOne(
    { _id: record.sessionId },
    {
      $set: {
        userId: record.userId,
        intake: record.intake,
        plan: record.plan,
        locale: record.locale ?? "en",
        createdAt: new Date(record.createdAt),
      },
    },
    { upsert: true }
  );
}

export async function getLatestPlanSessionForUser(
  userId: string
): Promise<SessionRecord | undefined> {
  const memorySessions = [...getMemoryStore().sessions.values()]
    .filter((s) => s.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (!isMongoEnabled()) {
    return memorySessions[0];
  }

  const db = await getDb();
  const row = await db
    .collection<PlanSessionDocument>(COLLECTIONS.planSessions)
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(1)
    .next();

  if (!row) {
    return memorySessions[0];
  }

  const record: SessionRecord = {
    sessionId: row._id,
    userId: row.userId,
    intake: row.intake,
    plan: row.plan,
    locale: row.locale ?? "en",
    createdAt: row.createdAt.toISOString(),
  };

  const cached = getMemoryStore().sessions.get(record.sessionId);
  if (!cached) {
    getMemoryStore().sessions.set(record.sessionId, record);
  }

  if (memorySessions[0]) {
    const memTime = new Date(memorySessions[0].createdAt).getTime();
    const dbTime = new Date(record.createdAt).getTime();
    return memTime >= dbTime ? memorySessions[0] : record;
  }

  return record;
}

export async function getSession(
  sessionId: string
): Promise<SessionRecord | undefined> {
  const cached = getMemoryStore().sessions.get(sessionId);
  if (cached) return cached;

  if (!isMongoEnabled()) return undefined;

  const db = await getDb();
  const row = await db
    .collection<PlanSessionDocument>(COLLECTIONS.planSessions)
    .findOne({ _id: sessionId });
  if (!row) return undefined;

  const record: SessionRecord = {
    sessionId: row._id,
    userId: row.userId,
    intake: row.intake,
    plan: row.plan,
    locale: row.locale ?? "en",
    createdAt: row.createdAt.toISOString(),
  };
  getMemoryStore().sessions.set(sessionId, record);
  return record;
}

export async function saveOrder(record: OrderRecord): Promise<void> {
  getMemoryStore().orders.set(record.orderId, record);
  if (record.pdfBuffer) {
    getMemoryStore().pdfBuffers.set(record.orderId, record.pdfBuffer);
  }

  if (!isMongoEnabled() || !record.userId || !record.planSessionId) return;

  const db = await getDb();
  await db.collection<OrderDocument>(COLLECTIONS.orders).updateOne(
    { orderId: record.orderId },
    {
      $set: {
        userId: record.userId,
        planSessionId: record.planSessionId,
        stripeSessionId: record.stripeSessionId,
        email: record.email,
        blobUrl: record.blobUrl,
        status: record.status ?? "paid",
        name: record.name,
        createdAt: new Date(record.createdAt),
      },
    },
    { upsert: true }
  );
}

export async function getOrder(
  orderId: string
): Promise<OrderRecord | undefined> {
  const cached = getMemoryStore().orders.get(orderId);
  if (cached) {
    const pdf = getMemoryStore().pdfBuffers.get(orderId);
    return pdf ? { ...cached, pdfBuffer: pdf } : cached;
  }

  if (!isMongoEnabled()) return undefined;

  const db = await getDb();
  const row = await db
    .collection<OrderDocument>(COLLECTIONS.orders)
    .findOne({ orderId });
  if (!row) return undefined;

  const record: OrderRecord = {
    orderId: row.orderId,
    sessionId: row.planSessionId,
    userId: row.userId,
    planSessionId: row.planSessionId,
    stripeSessionId: row.stripeSessionId,
    email: row.email,
    status: row.status,
    name: row.name,
    createdAt: row.createdAt.toISOString(),
    blobUrl: row.blobUrl,
  };
  getMemoryStore().orders.set(orderId, record);
  return record;
}

function sortOrdersNewestFirst(orders: OrderRecord[]): OrderRecord[] {
  return [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrdersByUserId(
  userId: string
): Promise<OrderRecord[]> {
  const memoryOrders = [...getMemoryStore().orders.values()].filter(
    (o) => o.userId === userId
  );

  if (!isMongoEnabled()) {
    return sortOrdersNewestFirst(memoryOrders);
  }

  const db = await getDb();
  const rows = await db
    .collection<OrderDocument>(COLLECTIONS.orders)
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  const byId = new Map<string, OrderRecord>();
  for (const row of rows) {
    byId.set(row.orderId, {
      orderId: row.orderId,
      sessionId: row.planSessionId,
      userId: row.userId,
      planSessionId: row.planSessionId,
      stripeSessionId: row.stripeSessionId,
      email: row.email,
      status: row.status,
      name: row.name,
      createdAt: row.createdAt.toISOString(),
      blobUrl: row.blobUrl,
    });
  }
  for (const order of memoryOrders) {
    byId.set(order.orderId, order);
  }

  return sortOrdersNewestFirst([...byId.values()]);
}

export function getOrderPdfBuffer(orderId: string): Buffer | undefined {
  return getMemoryStore().pdfBuffers.get(orderId);
}

export function setOrderPdfBuffer(orderId: string, buffer: Buffer): void {
  getMemoryStore().pdfBuffers.set(orderId, buffer);
}

const draftId = (userId: string) => userId;

export async function upsertIntakeDraft(
  userId: string,
  patch: Record<string, unknown>,
  opts: { step: number; locale: string }
): Promise<void> {
  const mem = getMemoryStore();
  const id = draftId(userId);
  const prev = mem.intakeDrafts.get(id);
  const merged: Record<string, unknown> = { ...prev?.intake, ...patch };
  const rec: IntakeDraftRecord = {
    userId,
    intake: merged,
    step: opts.step,
    locale: opts.locale,
    updatedAt: new Date().toISOString(),
  };
  mem.intakeDrafts.set(id, rec);

  if (!isMongoEnabled()) return;

  const db = await getDb();
  const doc: IntakeDraftDocument = {
    _id: id,
    userId,
    intake: merged,
    step: opts.step,
    locale: opts.locale,
    updatedAt: new Date(),
  };
  await db.collection<IntakeDraftDocument>(COLLECTIONS.intakeDrafts).updateOne(
    { _id: id },
    { $set: doc },
    { upsert: true }
  );
}

export async function getIntakeDraft(
  userId: string
): Promise<IntakeDraftRecord | null> {
  const id = draftId(userId);
  const mem = getMemoryStore();
  const cached = mem.intakeDrafts.get(id);
  if (cached) return cached;

  if (!isMongoEnabled()) return null;

  const db = await getDb();
  const row = await db
    .collection<IntakeDraftDocument>(COLLECTIONS.intakeDrafts)
    .findOne({ _id: id });
  if (!row) return null;

  const rec: IntakeDraftRecord = {
    userId: row.userId,
    intake: row.intake,
    step: row.step,
    locale: row.locale,
    updatedAt: row.updatedAt.toISOString(),
  };
  mem.intakeDrafts.set(id, rec);
  return rec;
}

export async function deleteIntakeDraft(userId: string): Promise<void> {
  const id = draftId(userId);
  getMemoryStore().intakeDrafts.delete(id);
  if (!isMongoEnabled()) return;
  const db = await getDb();
  await db
    .collection<IntakeDraftDocument>(COLLECTIONS.intakeDrafts)
    .deleteOne({ _id: id });
}
