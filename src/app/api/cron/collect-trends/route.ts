import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const maxDuration = 60;

const MAX_POST_AGE_DAYS = 30;

type ApifyRun = {
  id: string;
  category: string;
  run_id: string;
  dataset_id: string;
  status: string;
};

type ReelItem = {
  url?: string;
  shortCode?: string;
  ownerUsername?: string;
  displayUrl?: string;
  caption?: string;
  likesCount?: number;
  videoViewCount?: number;
  videoPlayCount?: number;
  commentsCount?: number;
  timestamp?: string;
};

function isWithinLastDays(timestamp: string | undefined, days: number): boolean {
  if (!timestamp) return false;
  const postedAt = new Date(timestamp).getTime();
  if (Number.isNaN(postedAt)) return false;
  return Date.now() - postedAt <= days * 24 * 60 * 60 * 1000;
}

async function markRunStatus(
  id: string,
  status: string,
  supabaseUrl: string,
  serviceKey: string
) {
  await fetch(`${supabaseUrl}/rest/v1/apify_runs?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status }),
  });
}

async function collectRun(
  run: ApifyRun,
  apifyToken: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<string> {
  const statusRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${run.run_id}?token=${apifyToken}`
  );
  if (!statusRes.ok) return "status_check_failed";

  const statusData = await statusRes.json();
  const runStatus: string = statusData?.data?.status;

  if (runStatus === "RUNNING" || runStatus === "READY") {
    return "still_running";
  }

  if (runStatus !== "SUCCEEDED") {
    await markRunStatus(run.id, "failed", supabaseUrl, serviceKey);
    return "failed";
  }

  const datasetRes = await fetch(
    `https://api.apify.com/v2/datasets/${run.dataset_id}/items?token=${apifyToken}`
  );
  if (!datasetRes.ok) {
    await markRunStatus(run.id, "failed", supabaseUrl, serviceKey);
    return "dataset_fetch_failed";
  }

  const items = (await datasetRes.json()) as ReelItem[];

  const rows = (Array.isArray(items) ? items : [])
    .filter(
      (item) => (item.url || item.shortCode) && isWithinLastDays(item.timestamp, MAX_POST_AGE_DAYS)
    )
    .map((item) => ({
      category: run.category,
      post_url: item.url ?? `https://www.instagram.com/reel/${item.shortCode}/`,
      account_handle: item.ownerUsername ?? null,
      thumbnail_url: item.displayUrl ?? null,
      caption: typeof item.caption === "string" ? item.caption.slice(0, 300) : null,
      like_count: item.likesCount ?? null,
      view_count: item.videoViewCount ?? item.videoPlayCount ?? null,
      comment_count: item.commentsCount ?? null,
      posted_at: item.timestamp ?? null,
    }));

  if (rows.length > 0) {
    await fetch(`${supabaseUrl}/rest/v1/trending_reels?on_conflict=post_url`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    });
  }

  await markRunStatus(run.id, "done", supabaseUrl, serviceKey);
  return `collected:${rows.length}`;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apifyToken = process.env.APIFY_API_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!apifyToken || !supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const pendingRes = await fetch(
    `${supabaseUrl}/rest/v1/apify_runs?select=*&status=eq.pending&purpose=eq.trends`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  );
  const pendingRuns = pendingRes.ok ? ((await pendingRes.json()) as ApifyRun[]) : [];

  const outcomes = await Promise.allSettled(
    pendingRuns.map((run) => collectRun(run, apifyToken, supabaseUrl, serviceKey))
  );

  const results = pendingRuns.map((run, i) => {
    const outcome = outcomes[i];
    return { category: run.category, result: outcome.status === "fulfilled" ? outcome.value : "error" };
  });

  if (results.some((r) => r.result.startsWith("collected"))) {
    revalidatePath("/trends");
  }

  return NextResponse.json({ ok: true, results });
}
