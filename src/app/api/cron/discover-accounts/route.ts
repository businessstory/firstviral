import { NextRequest, NextResponse } from "next/server";
import { TREND_CATEGORIES } from "@/lib/trends";
import { isAdminBasicAuth } from "@/lib/adminAuth";

export const maxDuration = 60;

const HASHTAG_ACTOR = "apify~instagram-hashtag-scraper";
const PROFILE_ACTOR = "apify~instagram-profile-scraper";
const CANDIDATE_LIMIT = 40;
const MIN_FOLLOWERS = 10000;
const TARGET_PER_CATEGORY = 15;

type HashtagItem = { ownerUsername?: string };
type ProfileItem = {
  username?: string;
  fullName?: string;
  followersCount?: number;
  profilePicUrl?: string;
};

async function discoverCategory(
  category: (typeof TREND_CATEGORIES)[number],
  apifyToken: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<number> {
  const hashtagRes = await fetch(
    `https://api.apify.com/v2/acts/${HASHTAG_ACTOR}/run-sync-get-dataset-items?token=${apifyToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hashtags: [category.hashtag],
        resultsLimit: CANDIDATE_LIMIT,
      }),
    }
  );
  if (!hashtagRes.ok) return 0;

  const posts = (await hashtagRes.json()) as HashtagItem[];
  const candidates = Array.from(
    new Set(posts.map((p) => p.ownerUsername).filter((u): u is string => !!u))
  );
  if (candidates.length === 0) return 0;

  const profileRes = await fetch(
    `https://api.apify.com/v2/acts/${PROFILE_ACTOR}/run-sync-get-dataset-items?token=${apifyToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: candidates }),
    }
  );
  if (!profileRes.ok) return 0;

  const profiles = (await profileRes.json()) as ProfileItem[];

  const qualified = profiles
    .filter((p) => p.username && (p.followersCount ?? 0) >= MIN_FOLLOWERS)
    .sort((a, b) => (b.followersCount ?? 0) - (a.followersCount ?? 0))
    .slice(0, TARGET_PER_CATEGORY)
    .map((p) => ({
      category: category.key,
      username: p.username,
      follower_count: p.followersCount ?? null,
      full_name: p.fullName ?? null,
      profile_pic_url: p.profilePicUrl ?? null,
    }));

  if (qualified.length === 0) return 0;

  await fetch(`${supabaseUrl}/rest/v1/tracked_accounts?on_conflict=username`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(qualified),
  });

  return qualified.length;
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
      discoverCategory(category, apifyToken, supabaseUrl, serviceKey)
    )
  );

  const results = Object.fromEntries(
    TREND_CATEGORIES.map((category, i) => {
      const outcome = outcomes[i];
      return [category.key, outcome.status === "fulfilled" ? outcome.value : 0];
    })
  );

  return NextResponse.json({ ok: true, results });
}
