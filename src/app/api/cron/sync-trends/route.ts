import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { TREND_CATEGORIES } from "@/lib/trends";

export const maxDuration = 60;

const ACTOR_ID = "apify~instagram-hashtag-scraper";
const RESULTS_PER_HASHTAG = 15;

type ApifyItem = {
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

async function syncCategory(
  category: (typeof TREND_CATEGORIES)[number],
  apifyToken: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<number> {
  const apifyRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${apifyToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hashtags: [category.hashtag],
        resultsLimit: RESULTS_PER_HASHTAG,
      }),
    }
  );

  if (!apifyRes.ok) return 0;

  const items = (await apifyRes.json()) as ApifyItem[];
  if (!Array.isArray(items)) return 0;

  const rows = items
    .filter((item) => item.url || item.shortCode)
    .map((item) => ({
      category: category.key,
      post_url: item.url ?? `https://www.instagram.com/p/${item.shortCode}/`,
      account_handle: item.ownerUsername ?? null,
      thumbnail_url: item.displayUrl ?? null,
      caption: typeof item.caption === "string" ? item.caption.slice(0, 300) : null,
      like_count: item.likesCount ?? null,
      view_count: item.videoViewCount ?? item.videoPlayCount ?? null,
      comment_count: item.commentsCount ?? null,
      posted_at: item.timestamp ?? null,
    }));

  if (rows.length === 0) return 0;

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

  return rows.length;
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

  const outcomes = await Promise.allSettled(
    TREND_CATEGORIES.map((category) =>
      syncCategory(category, apifyToken, supabaseUrl, serviceKey)
    )
  );

  const results = Object.fromEntries(
    TREND_CATEGORIES.map((category, i) => {
      const outcome = outcomes[i];
      return [category.key, outcome.status === "fulfilled" ? outcome.value : 0];
    })
  );

  revalidatePath("/trends");

  return NextResponse.json({ ok: true, results });
}
