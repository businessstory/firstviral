import TrendsBoard from "@/components/TrendsBoard";
import type { TrendingReel } from "@/lib/trends";

export const metadata = {
  title: "인기 콘텐츠 랭킹 | 퍼스트 바이럴",
  description: "카테고리별로 지금 인스타그램에서 터지고 있는 인기 콘텐츠를 한눈에 확인하세요.",
};

export const revalidate = 3600;

async function getTrendingReels(): Promise<TrendingReel[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const res = await fetch(
    `${url}/rest/v1/trending_reels?select=*&order=scraped_at.desc&limit=500`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function TrendsPage() {
  const reels = await getTrendingReels();

  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
          매일 자동 업데이트
        </span>
      </div>
      <h1 className="mt-3 text-xl font-extrabold text-neutral-900 md:text-2xl">인기 콘텐츠</h1>
      <p className="mt-2 text-sm text-neutral-500">지금 인스타그램에서 터지는 콘텐츠</p>

      <div className="mt-10">
        <TrendsBoard reels={reels} />
      </div>
    </section>
  );
}
