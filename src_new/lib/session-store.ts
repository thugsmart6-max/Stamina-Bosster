import type { OrderRecord, SessionRecord } from "./types";

type SessionStore = {
  sessions: Map<string, SessionRecord>;
  orders: Map<string, OrderRecord>;
};

const globalKey = "__StaminaBoost_session_store__";

function getStore(): SessionStore {
  const g = globalThis as typeof globalThis & {
    [key: string]: SessionStore | undefined;
  };
  if (!g[globalKey]) {
    g[globalKey] = {
      sessions: new Map(),
      orders: new Map(),
    };
  }
  return g[globalKey];
}

export function saveSession(record: SessionRecord) {
  getStore().sessions.set(record.sessionId, record);
}

export function getSession(sessionId: string): SessionRecord | undefined {
  return getStore().sessions.get(sessionId);
}

export function saveOrder(record: OrderRecord) {
  getStore().orders.set(record.orderId, record);
}

export function getOrder(orderId: string): OrderRecord | undefined {
  return getStore().orders.get(orderId);
}
