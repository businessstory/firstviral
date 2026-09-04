import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = [
  "/admin-952988",
  "/api/lead-status",
  "/api/tracked-accounts",
  "/api/newsletter-posts",
  "/api/upload-image",
  "/api/broadcast-email",
];

export function proxy(req: NextRequest) {
  if (!PROTECTED_PREFIXES.some((p) => req.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice(6));
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);

    if (expectedUser && expectedPass && user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

export const config = {
  matcher: [
    "/admin-952988/:path*",
    "/api/lead-status/:path*",
    "/api/tracked-accounts/:path*",
    "/api/newsletter-posts/:path*",
    "/api/upload-image/:path*",
    "/api/broadcast-email/:path*",
  ],
};
