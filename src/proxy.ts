import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH_PREFIX = "/admin-952988";

export function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith(ADMIN_PATH_PREFIX)) {
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

  const authHeaderDecoded = authHeader?.startsWith("Basic ") ? atob(authHeader.slice(6)) : null;
  return new NextResponse(
    `DEBUG hasExpectedUser=${!!expectedUser} hasExpectedPass=${!!expectedPass} expectedPassLen=${expectedPass?.length ?? 0} receivedLen=${authHeaderDecoded?.length ?? 0} exactMatch=${authHeaderDecoded === `${expectedUser}:${expectedPass}`}`,
    {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    }
  );
}

export const config = {
  matcher: "/admin-952988/:path*",
};
