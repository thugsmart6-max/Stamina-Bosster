import type { IntakeData, PlanResult } from "@/lib/types";
import type { ObjectId } from "mongodb";

export interface UserDocument {
  _id: ObjectId;
  fullName: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanSessionDocument {
  _id: string;
  userId: string;
  intake: IntakeData;
  plan: PlanResult;
  locale: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface OrderDocument {
  _id: ObjectId;
  orderId: string;
  userId: string;
  planSessionId: string;
  stripeSessionId?: string;
  email?: string;
  name: string;
  status: "pending" | "paid" | "failed";
  blobUrl?: string;
  createdAt: Date;
}

/** Partial wizard state — synced for cross-device recovery */
export interface IntakeDraftDocument {
  _id: string;
  userId: string;
  intake: Record<string, unknown>;
  step: number;
  locale: string;
  updatedAt: Date;
}

export const COLLECTIONS = {
  users: "users",
  planSessions: "plan_sessions",
  orders: "orders",
  intakeDrafts: "intake_drafts",
} as const;
