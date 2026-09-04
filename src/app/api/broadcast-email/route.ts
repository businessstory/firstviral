import { NextRequest, NextResponse } from "next/server";
import { getAllRecipientEmails } from "@/lib/supabase";

export const maxDuration = 60;

async function sendOne(to: string, subject: string, html: string, resendKey: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "퍼스트 바이럴 <noreply@businessstory.co.kr>",
      to: [to],
      subject,
      html,
    }),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  const { subject, body } = await req.json();

  if (typeof subject !== "string" || subject.trim().length < 1) {
    return NextResponse.json({ error: "invalid_subject" }, { status: 400 });
  }
  if (typeof body !== "string" || body.trim().length < 1) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const recipients = await getAllRecipientEmails();
  if (recipients.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, failed: 0, total: 0 });
  }

  const html = body
    .split("\n")
    .map((line: string) => `<p>${line}</p>`)
    .join("");

  const outcomes = await Promise.allSettled(
    recipients.map((to) => sendOne(to, subject.trim(), html, resendKey))
  );

  const sent = outcomes.filter((o) => o.status === "fulfilled" && o.value).length;
  const failed = recipients.length - sent;

  return NextResponse.json({ ok: true, sent, failed, total: recipients.length });
}
