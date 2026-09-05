import { NextRequest, NextResponse } from "next/server";
import { addTrackedAccount, deleteTrackedAccount } from "@/lib/supabase";
import { TREND_CATEGORIES } from "@/lib/trends";

// 계정 핸들이 "@handle" 또는 인스타그램 URL로 들어와도 순수 아이디만 뽑아냅니다.
function normalizeUsername(input: string): string {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/instagram\.com\/([^/?]+)/i);
  const raw = urlMatch ? urlMatch[1] : trimmed;
  return raw.replace(/^@/, "").trim();
}

// 카테고리를 지정하지 않고 계정을 추가하면, 현재 가장 계정 수가 적은
// 카테고리에 자동으로 배정해서 5개 카테고리 간 균형을 맞춥니다.
async function pickLeastPopulatedCategory(): Promise<string> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return TREND_CATEGORIES[0].key;

  const counts = await Promise.all(
    TREND_CATEGORIES.map(async (c) => {
      const res = await fetch(
        `${url}/rest/v1/tracked_accounts?select=id&category=eq.${c.key}`,
        {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            Prefer: "count=exact",
          },
        }
      );
      const range = res.headers.get("content-range") ?? "*/0";
      const count = Number(range.split("/")[1]) || 0;
      return { key: c.key, count };
    })
  );

  counts.sort((a, b) => a.count - b.count);
  return counts[0].key;
}

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  if (typeof username !== "string" || username.trim().length < 1) {
    return NextResponse.json({ error: "invalid_username" }, { status: 400 });
  }

  const category = await pickLeastPopulatedCategory();

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
