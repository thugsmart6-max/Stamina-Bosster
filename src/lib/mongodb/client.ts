import { MongoClient, type Db } from "mongodb";
import {
  MongoNetworkError,
  MongoNetworkTimeoutError,
  MongoServerSelectionError,
} from "mongodb";

const rawUri = process.env.MONGODB_URI;
const connectionUri = rawUri?.trim() ?? "";
const dbName = process.env.MONGODB_DB_NAME ?? "staminaboost";

/** Shared client options — Atlas + Windows often need IPv4 (`family: 4`) when IPv6 path fails. */
const mongoClientOptions = {
  serverSelectionTimeoutMS: 20_000,
  connectTimeoutMS: 20_000,
  retryWrites: true,
  family: 4 as const,
};

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoEnabled(): boolean {
  return Boolean(connectionUri);
}

/** Atlas SRV DNS misses (`querySrv ENOTFOUND`) are Node errors, not MongoServerSelectionError. */
export function isMongoConnectivityError(e: unknown): boolean {
  if (
    e instanceof MongoServerSelectionError ||
    e instanceof MongoNetworkError ||
    e instanceof MongoNetworkTimeoutError
  ) {
    return true;
  }
  if (typeof e === "object" && e !== null) {
    const err = e as { code?: string; syscall?: string; message?: string };
    if (
      err.code === "ENOTFOUND" ||
      err.code === "EAI_AGAIN" ||
      err.code === "ECONNREFUSED" ||
      err.syscall === "querySrv"
    ) {
      return true;
    }
    if (typeof err.message === "string" && err.message.includes("querySrv")) {
      return true;
    }
  }
  return false;
}

function getClientPromise(): Promise<MongoClient> {
  if (!connectionUri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!global.__mongoClientPromise) {
    const client = new MongoClient(connectionUri, mongoClientOptions);
    global.__mongoClientPromise = client.connect().catch((err) => {
      global.__mongoClientPromise = undefined;
      throw err;
    });
  }
  return global.__mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  try {
    const client = await getClientPromise();
    return client.db(dbName);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      global.__mongoClientPromise = undefined;
      if (isMongoConnectivityError(error)) {
        throw error;
      }
      try {
        const client = await getClientPromise();
        return client.db(dbName);
      } catch (retryError) {
        throw retryError;
      }
    }
    throw error;
  }
}
