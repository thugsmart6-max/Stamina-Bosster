import {
  readIntakeDoneFromRequest,
  readPaidAccessFromRequest,
  setIntakeDoneCookie,
  setPaidAccessCookie,
} from "@/lib/funnel-cookies";
import {
  getLatestPlanSessionForUser,
  getOrdersByUserId,
} from "@/lib/session-store";
import { setSessionCookie } from "@/lib/session-cookie";

export type FunnelRedirect = "/start" | "/checkout" | "/dashboard";

export type FunnelState = {
  intakeDone: boolean;
  paid: boolean;
  redirectTo: FunnelRedirect;
  latestSessionId?: string;
};

export async function resolveFunnelState(
  userId: string,
  request?: Request
): Promise<FunnelState> {
  const intakeCookie = request
    ? readIntakeDoneFromRequest(request)
    : false;
  const paidCookie = request ? readPaidAccessFromRequest(request) : false;

  const latestSession = await getLatestPlanSessionForUser(userId);
  const orders = await getOrdersByUserId(userId);
  const hasPaidOrder = orders.some((o) => o.status === "paid");

  const intakeDone = intakeCookie || Boolean(latestSession);
  const paid = paidCookie || hasPaidOrder;

  if (latestSession && !intakeCookie) {
    await setIntakeDoneCookie();
    await setSessionCookie(latestSession.sessionId);
  }
  if (hasPaidOrder && !paidCookie) {
    await setPaidAccessCookie();
  }

  let redirectTo: FunnelRedirect = "/start";
  if (paid) redirectTo = "/dashboard";
  else if (intakeDone) redirectTo = "/checkout";

  return {
    intakeDone,
    paid,
    redirectTo,
    latestSessionId: latestSession?.sessionId,
  };
}
