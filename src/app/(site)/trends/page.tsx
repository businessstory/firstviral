import TrendsBoard from "@/components/TrendsBoard";
import AuthGate from "@/components/AuthGate";
import PageTitle from "@/components/PageTitle";
import type { TrendingReel } from "@/lib/trends";

export const metadata = {
  title: "릴스 트렌드 랭킹 | 비즈니스 스토리",
  description: "카테고리별로 지금 인스타그램에서 터지고 있는 릴스 트렌드를 한눈에 확인하세요.",
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
    <>
      <PageTitle eyebrow="매일 자동 업데이트" title="릴스 트렌드" desc="지금 인스타그램에서 터지는 콘텐츠." />
      <section className="bg-brand-50">
        <div className="mx-auto max-w-6xl px-5 pb-20">
          <AuthGate>
            <TrendsBoard reels={reels} />
          </AuthGate>
        </div>
      </section>
    </>
  );
}
