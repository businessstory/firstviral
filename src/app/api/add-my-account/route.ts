import { NextRequest, NextResponse } from "next/server";
import { TREND_CATEGORIES } from "@/lib/trends";
import { isValidUserToken } from "@/lib/userAuth";

export const maxDuration = 30;

const REEL_ACTOR = "apify~instagram-reel-scraper";
const RESULTS_PER_ACCOUNT = 5;

function normalizeUsername(input: string): string {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/instagram\.com\/([^/?]+)/i);
  const raw = urlMatch ? urlMatch[1] : trimmed;
  return raw.replace(/^@/, "").trim();
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!(await isValidUserToken(authHeader))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { category, username } = await req.json();
  const validCategory = TREND_CATEGORIES.find((c) => c.key === category);
  if (!validCategory) {
    return NextResponse.json({ error: "invalid_category" }, { status: 400 });
  }

  const cleanUsername = typeof username === "string" ? normalizeUsername(username) : "";
  if (!cleanUsername) {
    return NextResponse.json({ error: "invalid_username" }, { status: 400 });
  }

  const apifyToken = process.env.APIFY_API_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!apifyToken || !supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  // 계정 등록 (이미 있으면 무시)
  await fetch(`${supabaseUrl}/rest/v1/tracked_accounts?on_conflict=username`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ category: validCategory.key, username: cleanUsername }),
  });

  // 이 계정만 바로 수집 시작 (전체 카테고리 재수집 아님, 비용/시간 절약)
  const runRes = await fetch(
    `https://api.apify.com/v2/acts/${REEL_ACTOR}/runs?token=${apifyToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: [cleanUsername], resultsLimit: RESULTS_PER_ACCOUNT }),
    }
  );

  if (!runRes.ok) {
    return NextResponse.json({ ok: true, started: false });
  }

  const runData = await runRes.json();
  const runId: string | undefined = runData?.data?.id;
  const datasetId: string | undefined = runData?.data?.defaultDatasetId;

  if (runId && datasetId) {
    await fetch(`${supabaseUrl}/rest/v1/apify_runs`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        category: validCategory.key,
        run_id: runId,
        dataset_id: datasetId,
        status: "pending",
        purpose: "trends",
      }),
    });
  }

  return NextResponse.json({ ok: true, started: true });
}
