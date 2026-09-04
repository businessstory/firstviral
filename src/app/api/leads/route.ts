import { NextRequest, NextResponse } from "next/server";
import { adminCreateLead, deleteLead } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const { name, phone, email, leadMagnet, agreePrivacy, agreeMarketing } = await req.json();

  if (typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (typeof phone !== "string" || phone.trim().length < 9) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const result = await adminCreateLead({
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    leadMagnet: typeof leadMagnet === "string" && leadMagnet.trim() ? leadMagnet.trim() : "manual",
    agreePrivacy: agreePrivacy === true,
    agreeMarketing: agreeMarketing === true,
  });

  if (!result.ok) {
    const status = result.reason === "not_configured" ? 501 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (typeof id !== "string" || id.length < 1) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const result = await deleteLead(id);
  if (!result.ok) {
    const status = result.reason === "not_configured" ? 501 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }
  return NextResponse.json({ ok: true });
}
