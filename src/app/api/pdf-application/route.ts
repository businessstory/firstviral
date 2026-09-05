import { NextRequest, NextResponse } from "next/server";
import { insertPdfApplication } from "@/lib/supabase";

const PHONE_RE = /^01[016789]-\d{3,4}-\d{4}$/;

export async function POST(req: NextRequest) {
  const { name, phone, reason, agreePrivacy } = await req.json();

  if (typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (typeof phone !== "string" || !PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }
  if (typeof reason !== "string" || reason.trim().length < 1) {
    return NextResponse.json({ error: "invalid_reason" }, { status: 400 });
  }
  if (agreePrivacy !== true) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  const result = await insertPdfApplication({
    name: name.trim(),
    phone: phone.trim(),
    reason: reason.trim(),
    agreePrivacy: true,
  });

  if (!result.ok) {
    const status = result.reason === "not_configured" ? 501 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }
  return NextResponse.json({ ok: true });
}
