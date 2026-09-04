"use client";

import { useMemo, useState } from "react";
import { TREND_CATEGORIES, type TrendingReel } from "@/lib/trends";

function formatCount(n: number | null): string {
  if (n === null || n === undefined || n < 0) return "비공개";
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString();
}

const MILLION = 1000000;
const MIN_VIEWS = 10000;

export default function TrendsBoard({ reels }: { reels: TrendingReel[] }) {
  const [category, setCategory] = useState<string>(TREND_CATEGORIES[0].key);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reels
      .filter((r) => r.category === category)
      .filter((r) => (r.view_count ?? 0) >= MIN_VIEWS)
      .filter((r) => {
        if (!q) return true;
        return (
          r.account_handle?.toLowerCase().includes(q) ||
          r.caption?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0));
  }, [reels, category, query]);

  return (
    <div>
      <div className="flex justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="계정명, 키워드 검색"
          className="w-full max-w-md rounded-full border border-black/10 px-5 py-3 text-sm outline-none transition-shadow focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {TREND_CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-transform active:scale-95 ${
              category === c.key
                ? "bg-brand-700 text-white"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-neutral-400">
          최근 30일 이내 1만 뷰를 넘은 콘텐츠가 아직 없어요. 곧 업데이트됩니다.
        </p>
      ) : (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((reel, i) => (
              <a
                key={reel.id}
                href={reel.post_url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  {reel.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={reel.thumbnail_url}
                      alt={reel.account_handle ?? "인기 콘텐츠"}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-neutral-300">
                      이미지 없음
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white">
                    TOP {i + 1}
                  </span>
                  {(reel.view_count ?? 0) >= MILLION && (
                    <span className="absolute right-3 top-3 rounded-full bg-accent-gold px-2.5 py-1 text-[11px] font-bold text-brand-950">
                      🔥 100만 뷰
                    </span>
                  )}
                </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-sm font-bold text-neutral-900">
                  @{reel.account_handle ?? "unknown"}
                </p>
                {reel.caption && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500">
                    {reel.caption}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-3 pt-1 text-xs font-semibold text-neutral-400">
                  <span>조회수 {formatCount(reel.view_count)}</span>
                  <span>좋아요 {formatCount(reel.like_count)}</span>
                </div>
              </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
