import { NextRequest, NextResponse } from "next/server";
import { TREND_CATEGORIES } from "@/lib/trends";
import { isAdminBasicAuth } from "@/lib/adminAuth";

export const maxDuration = 60;

const REEL_ACTOR = "apify~instagram-reel-scraper";
const RESULTS_PER_ACCOUNT = 5;

// 카테고리당 하루에 동기화할 계정 수. 5개 카테고리 x 4 = 하루 총 20개.
// 계정이 아무리 많아져도(예: 1000개) 이 숫자만큼만 매일 순환하며 동기화되므로
// 무료 크레딧 예산이 계정 총수와 무관하게 항상 일정하게 유지됩니다.
const DAILY_BATCH_PER_CATEGORY = 4;

async function getAccountsToSync(
  categoryKey: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<{ id: string; username: string }[]> {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/tracked_accounts?select=id,username&category=eq.${categoryKey}&order=last_synced_at.asc.nullsfirst&limit=${DAILY_BATCH_PER_CATEGORY}`,
    {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    }
  );
  if (!res.ok) return [];
  return (await res.json()) as { id: string; username: string }[];
}

async function markAccountsSynced(
  ids: string[],
  supabaseUrl: string,
  serviceKey: string
): Promise<void> {
  if (ids.length === 0) return;
  const idList = ids.join(",");
  await fetch(`${supabaseUrl}/rest/v1/tracked_accounts?id=in.(${idList})`, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ last_synced_at: new Date().toISOString() }),
  });
}

// 결과를 기다리지 않고 Apify에 수집만 "시작"시킵니다 (Vercel 함수 시간제한 회피).
// 실제 결과는 /api/cron/collect-trends 가 나중에 와서 가져갑니다.
async function startCategory(
  category: (typeof TREND_CATEGORIES)[number],
  apifyToken: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<"started" | "no_accounts" | "start_failed"> {
  const accounts = await getAccountsToSync(category.key, supabaseUrl, serviceKey);
  if (accounts.length === 0) return "no_accounts";
  const usernames = accounts.map((a) => a.username);

  const runRes = await fetch(
    `https://api.apify.com/v2/acts/${REEL_ACTOR}/runs?token=${apifyToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernames,
        resultsLimit: RESULTS_PER_ACCOUNT,
      }),
    }
  );

  if (!runRes.ok) return "start_failed";

  const runData = await runRes.json();
  const runId: string | undefined = runData?.data?.id;
  const datasetId: string | undefined = runData?.data?.defaultDatasetId;
  if (!runId || !datasetId) return "start_failed";

  await fetch(`${supabaseUrl}/rest/v1/apify_runs`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      category: category.key,
      run_id: runId,
      dataset_id: datasetId,
      status: "pending",
      purpose: "trends",
    }),
  });

  await markAccountsSynced(
    accounts.map((a) => a.id),
    supabaseUrl,
    serviceKey
  );

  return "started";
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isCron && !isAdminBasicAuth(authHeader)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apifyToken = process.env.APIFY_API_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!apifyToken || !supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const outcomes = await Promise.allSettled(
    TREND_CATEGORIES.map((category) =>
      startCategory(category, apifyToken, supabaseUrl, serviceKey)
    )
  );

  const results = Object.fromEntries(
    TREND_CATEGORIES.map((category, i) => {
      const outcome = outcomes[i];
      return [category.key, outcome.status === "fulfilled" ? outcome.value : "error"];
    })
  );

  return NextResponse.json({ ok: true, started: results });
}
