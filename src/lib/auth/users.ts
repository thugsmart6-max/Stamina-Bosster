import { getEmailFormatError, normalizeEmail } from "@/lib/email-format";
import { COLLECTIONS, type UserDocument } from "@/lib/mongodb/models";
import { getDb, isMongoEnabled } from "@/lib/mongodb/client";
import type { Locale } from "@/i18n/routing";
import { ObjectId } from "mongodb";

export type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
};

function docToRecord(doc: UserDocument): UserRecord {
  return {
    id: doc._id.toHexString(),
    fullName: doc.fullName,
    email: doc.email,
    phone: doc.phone ?? null,
    passwordHash: doc.passwordHash,
    locale: doc.locale,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function ensureUserIndexes(): Promise<void> {
  if (!isMongoEnabled()) return;
  const db = await getDb();
  await db.collection(COLLECTIONS.users).createIndex({ email: 1 }, { unique: true });
  await db
    .collection(COLLECTIONS.users)
    .createIndex({ phone: 1 }, { unique: true, sparse: true });
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  if (!isMongoEnabled()) return null;
  const db = await getDb();
  const doc = await db
    .collection<UserDocument>(COLLECTIONS.users)
    .findOne({ email: normalizeEmail(email) });
  return doc ? docToRecord(doc) : null;
}

export async function findUserByPhone(phone: string): Promise<UserRecord | null> {
  if (!isMongoEnabled()) return null;
  const db = await getDb();
  const doc = await db
    .collection<UserDocument>(COLLECTIONS.users)
    .findOne({ phone: phone.trim() });
  return doc ? docToRecord(doc) : null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  if (!isMongoEnabled() || !ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<UserDocument>(COLLECTIONS.users)
    .findOne({ _id: new ObjectId(id) });
  return doc ? docToRecord(doc) : null;
}

export async function findUserByLogin(login: string): Promise<UserRecord | null> {
  const trimmed = login.trim();
  const byEmail = await findUserByEmail(trimmed);
  if (byEmail) return byEmail;
  return findUserByPhone(trimmed);
}

export async function createUser(input: {
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  locale?: Locale;
}): Promise<UserRecord> {
  if (!isMongoEnabled()) {
    throw new Error("MONGODB_URI is not configured");
  }

  const formatError = getEmailFormatError(input.email);
  if (formatError) {
    throw new Error(formatError);
  }

  const now = new Date();
  const db = await getDb();
  const result = await db.collection<UserDocument>(COLLECTIONS.users).insertOne({
    _id: new ObjectId(),
    fullName: input.fullName.trim(),
    email: normalizeEmail(input.email),
    phone: input.phone?.trim() ?? null,
    passwordHash: input.passwordHash,
    locale: input.locale ?? "en",
    createdAt: now,
    updatedAt: now,
  });

  const doc = await db
    .collection<UserDocument>(COLLECTIONS.users)
    .findOne({ _id: result.insertedId });
  if (!doc) throw new Error("Failed to create user");
  return docToRecord(doc);
}

export async function updateUserProfile(
  userId: string,
  data: { fullName?: string; locale?: string }
): Promise<void> {
  if (!isMongoEnabled() || !ObjectId.isValid(userId)) return;
  const db = await getDb();
  await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}
