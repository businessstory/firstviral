"use client";

import { useMemo, useState } from "react";
import { TREND_CATEGORIES, type TrendingReel } from "@/lib/trends";
import Tag from "./Tag";

function formatCount(n: number | null): string {
  if (n === null || n === undefined || n < 0) return "비공개";
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString();
}

// 썸네일은 수집할 때 우리 저장소에 영구 복사해 둬요. 그래도 어떤 이유로 이미지가 안 열리면
// 깨진 이미지나 "이미지 없음" 칸 대신 카드 자체를 숨겨요.
function ReelThumbnail({ src, alt, onGiveUp }: { src: string; alt: string; onGiveUp: () => void }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={onGiveUp}
      className="h-full w-full object-cover transition-transform group-hover:scale-105"
    />
  );
}

// 인스타그램 CDN 주소의 oe 값은 만료 시각(16진수 유닉스 초)이에요
function isExpiredCdnUrl(url: string, now: number) {
  const m = url.match(/[?&]oe=([0-9A-Fa-f]+)/);
  return !!m && parseInt(m[1], 16) * 1000 < now;
}

const MILLION = 1000000;
const MIN_VIEWS = 10000;
const ALL_KEY = "all";
const TABS = [{ key: ALL_KEY, label: "모든 콘텐츠" }, ...TREND_CATEGORIES];

export default function TrendsBoard({ reels }: { reels: TrendingReel[] }) {
  const [category, setCategory] = useState<string>(ALL_KEY);
  const [now] = useState(() => Date.now());
  const [broken, setBroken] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return reels
      .filter((r) => category === ALL_KEY || r.category === category)
      .filter((r) => (r.view_count ?? 0) >= MIN_VIEWS)
      // 썸네일이 없거나 인스타그램 임시 주소가 이미 만료된 릴스(원본 삭제·비공개 등)는 "이미지 없음" 대신 숨긴다
      .filter((r) => !!r.thumbnail_url && !isExpiredCdnUrl(r.thumbnail_url, now) && !broken.includes(r.id))
      .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0));
  }, [reels, category, now, broken]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className={`press rounded-full px-4 py-2 text-[14px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              category === c.key
                ? "bg-brand-950 text-white"
                : "bg-white text-brand-950 hover:bg-brand-100"
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
                className="group flex flex-col overflow-hidden rounded-[18px] bg-white transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  <ReelThumbnail
                    src={reel.thumbnail_url ?? ""}
                    alt={reel.account_handle ?? "릴스 트렌드"}
                    onGiveUp={() => setBroken((b) => (b.includes(reel.id) ? b : [...b, reel.id]))}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white">
                    TOP {i + 1}
                  </span>
                  {(reel.view_count ?? 0) >= MILLION && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-950 backdrop-blur">
                      🔥 100만 뷰
                    </span>
                  )}
                </div>
              <div className="flex flex-col gap-1.5 p-3.5">
                <p className="truncate text-sm font-bold text-neutral-900">
                  @{reel.account_handle ?? "unknown"}
                </p>
                <Tag>조회수 {formatCount(reel.view_count)}</Tag>
              </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
