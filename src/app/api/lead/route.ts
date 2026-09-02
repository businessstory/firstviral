import { NextRequest, NextResponse } from "next/server";
import { insertLead } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 이메일 발송(관리자 알림 + 1분 뒤 신청자 확인 메일)은 Supabase DB 트리거가 처리합니다.
// leads 테이블에 insert되는 순간 자동으로 실행되므로, 여기서는 저장만 담당합니다.
// (supabase.sql 의 on_lead_created 트리거 참고)
export async function POST(req: NextRequest) {
  const { name, phone, email, leadMagnet } = await req.json();

  if (typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (typeof phone !== "string" || phone.trim().length < 9) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (typeof leadMagnet !== "string" || leadMagnet.trim().length < 1) {
    return NextResponse.json({ error: "invalid_lead_magnet" }, { status: 400 });
  }

  const result = await insertLead({ name, phone, email, leadMagnet });

  if (!result.ok) {
    const status = result.reason === "not_configured" ? 501 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }

  return NextResponse.json({ ok: true });
}
