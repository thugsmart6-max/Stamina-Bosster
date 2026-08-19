import type { AuthUser } from "@/lib/types";
import { isMongoEnabled } from "@/lib/mongodb/client";
import { findUserById } from "./users";
import {
  getAuthTokenFromCookie,
  getAuthTokenFromRequest,
  verifyAuthToken,
} from "./session";

function recordToAuthUser(row: {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  locale: string;
}): AuthUser {
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    locale: row.locale,
  };
}

export async function getCurrentUser(
  request?: Request
): Promise<AuthUser | null> {
  const token = request
    ? getAuthTokenFromRequest(request)
    : await getAuthTokenFromCookie();

  if (!token) return null;

  const payload = await verifyAuthToken(token);
  if (!payload) return null;

  if (!isMongoEnabled()) return null;

  try {
    const row = await findUserById(payload.sub);
    if (!row) return null;
    return recordToAuthUser(row);
  } catch {
    return null;
  }
}

export async function requireAuth(
  request?: Request
): Promise<{ user: AuthUser } | { error: string; status: number }> {
  const user = await getCurrentUser(request);
  if (!user) {
    return { error: "Authentication required", status: 401 };
  }
  return { user };
}

/** @deprecated Use requireAuth — email verification removed */
export async function requireVerifiedAuth(
  request?: Request
): Promise<{ user: AuthUser } | { error: string; status: number }> {
  return requireAuth(request);
}
