import { NextResponse, type NextRequest } from "next/server";

/**
 * English is the default and has no prefix:   /durga-puja  -> app/[lang=en]/durga-puja
 * Hindi lives under /hi:                       /hi/durga-puja
 * /en/... is redirected to the clean URL so Google sees one address per page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/hi" || pathname.startsWith("/hi/")) return;

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next.js internals and files like favicon.ico, sitemap.xml, robots.txt
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
