import { NextRequest, NextResponse } from "next/server";
import { addTrackedAccount, deleteTrackedAccount } from "@/lib/supabase";
import { TREND_CATEGORIES } from "@/lib/trends";

const VALID_CATEGORIES = new Set(TREND_CATEGORIES.map((c) => c.key));

// 계정 핸들이 "@handle" 또는 인스타그램 URL로 들어와도 순수 아이디만 뽑아냅니다.
function normalizeUsername(input: string): string {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/instagram\.com\/([^/?]+)/i);
  const raw = urlMatch ? urlMatch[1] : trimmed;
  return raw.replace(/^@/, "").trim();
}

export async function POST(req: NextRequest) {
  const { category, username } = await req.json();

  if (typeof category !== "string" || !VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: "invalid_category" }, { status: 400 });
  }
  if (typeof username !== "string" || username.trim().length < 1) {
    return NextResponse.json({ error: "invalid_username" }, { status: 400 });
  }

  const result = await addTrackedAccount({
    category,
    username: normalizeUsername(username),
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

  const result = await deleteTrackedAccount(id);
  if (!result.ok) {
    const status = result.reason === "not_configured" ? 501 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }
  return NextResponse.json({ ok: true });
}
