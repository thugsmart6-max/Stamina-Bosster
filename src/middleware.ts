import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import {
  isAuthPage,
  isProtectedPath,
  readAuthFromRequest,
  stripLocalePath,
} from "@/lib/auth/middleware";
import {
  readIntakeDoneFromRequest,
  readPaidAccessFromRequest,
} from "@/lib/funnel-cookies";
import { routing, stripLocalePrefixes } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function redirectTo(request: NextRequest, locale: string, path: string) {
  return NextResponse.redirect(new URL(`/${locale}${path}`, request.url));
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel")
  ) {
    return NextResponse.next();
  }

  const { locale, path } = stripLocalePath(pathname, routing.locales);
  const canonicalPath = stripLocalePrefixes(path);
  if (canonicalPath !== path) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${canonicalPath === "/" ? "" : canonicalPath}`;
    return NextResponse.redirect(url);
  }

  const intakeDone = readIntakeDoneFromRequest(request);
  const paid = readPaidAccessFromRequest(request);

  if (pathname.startsWith("/guides")) {
    if (!paid) {
      return redirectTo(request, locale, intakeDone ? "/checkout" : "/start");
    }
  }

  if (path === "/pricing") {
    if (!intakeDone) {
      return redirectTo(request, locale, "/start");
    }
    return redirectTo(request, locale, paid ? "/dashboard" : "/checkout");
  }

  if (path === "/checkout") {
    if (!intakeDone) {
      return redirectTo(request, locale, "/start");
    }
    if (paid) {
      return redirectTo(request, locale, "/dashboard");
    }
  }

  if (path === "/start" && intakeDone) {
    const isEdit = request.nextUrl.searchParams.get("edit") === "1";
    if (!isEdit) {
      return redirectTo(
        request,
        locale,
        paid ? "/dashboard" : "/checkout"
      );
    }
  }

  if (path === "/preview") {
    if (!intakeDone) {
      return redirectTo(request, locale, "/start");
    }
    if (!paid) {
      return redirectTo(request, locale, "/checkout");
    }
  }

  if (path.startsWith("/dashboard")) {
    if (!paid) {
      return redirectTo(request, locale, intakeDone ? "/checkout" : "/start");
    }
  }

  if (isProtectedPath(path)) {
    const auth = await readAuthFromRequest(request);
    if (!auth) {
      const login = new URL(`/${locale}/login`, request.url);
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
  }

  if (isAuthPage(path)) {
    const auth = await readAuthFromRequest(request);
    if (auth) {
      if (paid) return redirectTo(request, locale, "/dashboard");
      if (intakeDone) return redirectTo(request, locale, "/checkout");
      return redirectTo(request, locale, "/start");
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/guides/:path*"],
};
