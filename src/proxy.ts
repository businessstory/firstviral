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

  function mask(v?: string) {
    if (!v) return "undefined";
    if (v.length <= 4) return `len${v.length}:${v[0] ?? ""}***`;
    return `len${v.length}:${v.slice(0, 2)}...${v.slice(-2)}`;
  }

  const authHeaderDecoded = authHeader?.startsWith("Basic ") ? atob(authHeader.slice(6)) : null;
  const recvUser = authHeaderDecoded?.split(":")[0];
  const recvPass = authHeaderDecoded ? authHeaderDecoded.slice(authHeaderDecoded.indexOf(":") + 1) : undefined;

  return new NextResponse(
    `DEBUG expectedUser=${mask(expectedUser)} expectedPass=${mask(expectedPass)} receivedUser=${mask(recvUser)} receivedPass=${mask(recvPass)} userMatch=${recvUser === expectedUser} passMatch=${recvPass === expectedPass} passTrimMatch=${recvPass?.trim() === expectedPass?.trim()}`,
    {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    }
  );
}

export const config = {
  matcher: "/admin-952988/:path*",
};
