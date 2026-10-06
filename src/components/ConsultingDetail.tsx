"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { consultingReviews } from "@/data/consulting-reviews";

const APPLY_URL = "https://open.kakao.com/o/sJy1y4Qi";

// 상세페이지 이미지 (위에서부터 순서대로 노출, 모두 가로 1080px)
const detailImages = [
  { src: "/consulting/detail-00.webp", height: 3000 },
  { src: "/consulting/detail-13.webp", height: 3000 },
  { src: "/consulting/detail-07.webp", height: 3000 },
  { src: "/consulting/detail-15.webp", height: 3000 },
  { src: "/consulting/detail-17.webp", height: 3103 },
  { src: "/consulting/detail-06.webp", height: 3000 },
  { src: "/consulting/detail-08.webp", height: 3000 },
  { src: "/consulting/detail-10.webp", height: 3000 },
  { src: "/consulting/detail-02.webp", height: 3000 },
  { src: "/consulting/detail-05.webp", height: 3000 },
  { src: "/consulting/detail-04.webp", height: 3000 },
  { src: "/consulting/detail-09.webp", height: 3000 },
  { src: "/consulting/detail-14.webp", height: 3000 },
  { src: "/consulting/detail-16.webp", height: 3000 },
  { src: "/consulting/detail-11.webp", height: 3000 },
  { src: "/consulting/detail-01.webp", height: 3000 },
  { src: "/consulting/detail-12.webp", height: 3000 },
  { src: "/consulting/detail-03.webp", height: 3000 },
];

const notices = [
  "지방이나 제주도에서 오시는 분들이 많아",
  "주말에도 컨설팅은 진행합니다.",
  "",
  "컨설팅 위치: 서울 서초구 서초대로 243 서현빌딩 4층",
  "",
  "오프라인 컨설팅이 훨씬 더 많이 도움받을 수 있습니다.",
  "*ZOOM으로 할 수밖에 없는 분들은 비대면으로도 진행합니다*",
];

const ACCENT = "#4b4ef0";
const APPLY_BTN =
  "flex h-14 w-full items-center justify-center rounded-lg bg-[#4b4ef0] text-base font-bold text-white shadow-[0_8px_20px_rgba(75,78,240,0.28)] transition-transform hover:scale-[1.01] hover:bg-[#3d40d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4b4ef0] focus-visible:ring-offset-2 active:scale-[0.98]";
const ICON_BTN =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-transform hover:scale-105 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4b4ef0] active:scale-95";
const CARD = "rounded-xl border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(20,20,60,0.05)]";

type Section = "intro" | "reviews";

// 짧게 요약해서 보여줄 BEST 후기 (consultingReviews의 순서)
const BEST = [14, 10, 8];

export default function ConsultingDetail() {
  const [active, setActive] = useState<Section>("intro");
  const [toast, setToast] = useState(false);
  const introRef = useRef<HTMLElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);

  // 스크롤 위치에 따라 탭 활성화
  useEffect(() => {
    const onScroll = () => {
      const r = reviewsRef.current?.getBoundingClientRect().top ?? Infinity;
      setActive(r < 140 ? "reviews" : "intro");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(section: Section) {
    const el = section === "intro" ? introRef.current : reviewsRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "1:1 맞춤 인스타그램 컨설팅", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    } catch {
      // 공유 창을 닫은 경우 등은 무시
    }
  }

  const priceCard = (
    <div className={`${CARD} p-6`}>
      <p className="text-[17px] font-bold">수강 옵션</p>
      <div className="mt-4 rounded-lg border-2 border-[#4b4ef0] bg-[#f3f4ff] p-4">
        <p className="text-[15px] font-bold">1:1 맞춤 컨설팅</p>
        <p className="mt-1.5 text-[13px] text-neutral-600">진행 시간: 2시간 · 오프라인 / ZOOM</p>
        <p className="mt-3 text-right">
          <span className="mr-2 text-sm text-neutral-400 line-through">69,000원</span>
          <span className="text-lg font-bold">30,000원</span>
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-5">
        <span className="text-[15px] font-bold">최종 결제금액</span>
        <span className="flex items-baseline gap-2">
          <span className="text-base font-bold text-[#ff4a2a]">57%</span>
          <span className="text-2xl font-extrabold" style={{ color: ACCENT }}>30,000원</span>
        </span>
      </div>
      <a href={APPLY_URL} target="_blank" rel="noreferrer" className={`mt-5 ${APPLY_BTN}`}>
        컨설팅 신청하기
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-28 text-neutral-900 lg:pb-20">
      {/* 상단 바 */}
      <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-5">
        <Link href="/" className="relative h-5 w-[130px]" aria-label="비즈니스 스토리 홈">
          <Image src="/brand/logo-business-story.png" alt="비즈니스 스토리" fill sizes="130px" className="object-contain object-left" />
        </Link>
        <Link
          href="/361"
          aria-label="닫기"
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition-transform hover:scale-105 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4b4ef0] active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 lg:grid lg:grid-cols-[minmax(0,1fr)_384px] lg:gap-8">
        {/* 왼쪽: 썸네일 + BEST 후기 + 본문 */}
        <div className="min-w-0">
          <div className="relative aspect-[1080/650] w-full overflow-hidden rounded-xl bg-neutral-100">
            <Image src="/consulting/thumbnail.webp" alt="2026 1:1 맞춤 인스타그램 컨설팅" fill priority sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
          </div>

          {/* 모바일: 제목 + 가격 */}
          <div className="mt-5 lg:hidden">
            <TitleBlock onShare={share} />
            <div className="mt-4">{priceCard}</div>
          </div>

          {/* BEST 후기 */}
          <div className="mt-10 flex items-center justify-between">
            <h2 className="text-[22px] font-extrabold">BEST 후기</h2>
            <button
              type="button"
              onClick={() => goTo("reviews")}
              className="flex items-center gap-1 rounded text-[15px] font-semibold transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4b4ef0] active:opacity-50"
              style={{ color: ACCENT }}
            >
              더보기
              <Chevron />
            </button>
          </div>
          <div className="-mx-5 mt-4 flex snap-x gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {BEST.map((idx) => {
              const r = consultingReviews[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo("reviews")}
                  className="w-[78%] shrink-0 snap-start rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-left transition-colors hover:border-neutral-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4b4ef0] active:scale-[0.99] md:w-auto"
                >
                  <span className="text-sm font-bold">{r.name}</span>
                  <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-700">{r.text.replace(/\n+/g, " ")}</span>
                  <span className="mt-3 flex items-center gap-1 text-sm font-semibold" style={{ color: ACCENT }}>
                    더보기 <Chevron />
                  </span>
                </button>
              );
            })}
          </div>

          {/* 탭 */}
          <div className="sticky top-0 z-20 -mx-5 mt-10 border-b border-neutral-200 bg-white px-5 md:mx-0 md:px-0">
            <div className="flex gap-2" role="tablist">
              <TabButton active={active === "intro"} onClick={() => goTo("intro")}>
                소개
              </TabButton>
              <TabButton active={active === "reviews"} onClick={() => goTo("reviews")}>
                컨설팅 후기 <span style={{ color: ACCENT }}>{consultingReviews.length}</span>
              </TabButton>
            </div>
          </div>

          {/* 소개: 상세 이미지 */}
          <section ref={introRef} className="mx-auto max-w-[720px] pt-8">
            {detailImages.map(({ src, height }, i) => (
              <Image
                key={src}
                src={src}
                alt={`1:1 인스타그램 컨설팅 상세 ${i + 1}`}
                width={1080}
                height={height}
                sizes="(min-width: 1024px) 720px, 100vw"
                className="block h-auto w-full"
              />
            ))}

            <div className="mt-12 rounded-2xl bg-neutral-50 px-5 py-8 text-center ring-1 ring-neutral-200">
              <p className="text-[min(4.2vw,17px)] font-bold">
                <Nowrap>* 1:1 인스타그램 컨설팅 신청 후 *</Nowrap>
              </p>
              <p className="mt-4 text-[min(3.9vw,16px)] leading-relaxed text-neutral-700">
                <Nowrap>카카오톡으로 일정 조율차 연락드릴 예정입니다</Nowrap>
                <Nowrap>(추가금 없습니다!)</Nowrap>
              </p>
              <p className="mt-6 text-[min(3.6vw,16px)] leading-relaxed text-neutral-700">
                {notices.map((line, i) => (line ? <Nowrap key={i}>{line}</Nowrap> : <br key={i} />))}
              </p>
            </div>
          </section>

          {/* 후기: 상품정보 맨 아래에 이어서 노출 */}
          <section ref={reviewsRef} className="mx-auto mt-16 max-w-[720px]">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h2 className="text-xl font-bold">컨설팅 후기</h2>
              <span className="flex items-center gap-1.5 text-base font-bold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#6d5dfc" aria-hidden>
                  <path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.4 6.1L4.5 21l4.2-2.3c1 .2 2.1.3 3.3.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z" />
                </svg>
                {consultingReviews.length}개
              </span>
            </div>
            <ul className="divide-y divide-neutral-200">
              {consultingReviews.map((r, i) => (
                <ReviewItem key={i} name={r.name} date={r.date} text={r.text} />
              ))}
            </ul>
            <div className="mt-8 hidden lg:block">
              <a href={APPLY_URL} target="_blank" rel="noreferrer" className={APPLY_BTN}>
                1:1 컨설팅 신청하기
              </a>
            </div>
          </section>
        </div>

        {/* 오른쪽: 제목 + 가격 (PC에서 스크롤 따라 고정) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 flex flex-col gap-4">
            <div className={`${CARD} p-6`}>
              <TitleBlock onShare={share} />
            </div>
            {priceCard}
          </div>
        </aside>
      </div>

      {/* 모바일 하단 고정 신청 바 */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-100 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[720px] items-center gap-3 px-4 py-2.5">
          <span className="shrink-0 text-lg font-extrabold" style={{ color: ACCENT }}>30,000원</span>
          <a href={APPLY_URL} target="_blank" rel="noreferrer" className={APPLY_BTN}>
            컨설팅 신청하기
          </a>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white">
          링크가 복사됐어요
        </div>
      )}
    </div>
  );
}

function TitleBlock({ onShare }: { onShare: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-[22px] font-extrabold leading-snug tracking-tight">1:1 맞춤 인스타그램 컨설팅</h1>
        <button type="button" onClick={onShare} aria-label="공유하기" className={ICON_BTN}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
          </svg>
        </button>
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
        내 계정의 문제를 진단하고, 지금 바로 시작할 수 있는 1:1 맞춤 수익화 로드맵을 받아가세요.
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
        <span className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#6d5dfc" aria-hidden>
            <path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.4 6.1L4.5 21l4.2-2.3c1 .2 2.1.3 3.3.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z" />
          </svg>
          후기 {consultingReviews.length}개
        </span>
        <span className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#555" aria-hidden>
            <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z" />
          </svg>
          750회 이상 진행
        </span>
      </p>
    </>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative flex h-14 items-center gap-1.5 whitespace-nowrap px-5 text-[16px] transition-colors focus:outline-none focus-visible:bg-neutral-50 ${
        active ? "font-bold text-[#4b4ef0]" : "font-medium text-neutral-600 hover:text-neutral-900"
      }`}
    >
      {children}
      {active && <span className="absolute inset-x-0 -bottom-px h-[3px] bg-[#4b4ef0]" />}
    </button>
  );
}

function Nowrap({ children }: { children: React.ReactNode }) {
  return <span className="block whitespace-nowrap">{children}</span>;
}

function ReviewItem({ name, date, text }: { name: string; date?: string; text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 140;
  return (
    <li className="flex gap-4 py-7">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[15px] font-semibold text-neutral-600">
        {name[0]}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[15px] font-semibold">{name}</span>
          {date && <span className="text-[13px] text-neutral-500">{date}</span>}
        </div>
        <p className={`mt-2 whitespace-pre-line text-[15px] leading-relaxed text-neutral-800 ${!open && long ? "line-clamp-3" : ""}`}>
          {text}
        </p>
        {long && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-3 inline-flex items-center gap-1 rounded text-sm font-semibold text-[#4a5cf0] transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a5cf0] active:opacity-50"
          >
            {open ? "접기" : "더보기"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={open ? "-rotate-90" : ""} aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
    </li>
  );
}
