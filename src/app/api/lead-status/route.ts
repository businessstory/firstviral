import { NextRequest, NextResponse } from "next/server";
import { updateLeadStatus } from "@/lib/supabase";

// 이 라우트는 proxy.ts의 matcher에 포함되어 있어 관리자 인증 없이는 호출할 수 없습니다.
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();

  if (typeof id !== "string" || (status !== "pending" && status !== "done")) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await updateLeadStatus(id, status);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
