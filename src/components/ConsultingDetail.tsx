"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { consultingReviewImages, consultingReviews } from "@/data/consulting-reviews";

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

const APPLY_BTN =
  "flex h-14 flex-1 items-center justify-center rounded-xl bg-black text-base font-bold text-white transition-transform hover:scale-[1.01] hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]";
const SHARE_BTN =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-black text-white transition-transform hover:scale-[1.03] hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-95";

type Tab = "detail" | "reviews";

export default function ConsultingDetail() {
  const [tab, setTab] = useState<Tab>("detail");
  const [toast, setToast] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  function openTab(next: Tab) {
    setTab(next);
    // 탭을 누르면 탭 바로 아래부터 보이도록 스크롤
    requestAnimationFrame(() => {
      const top = (tabsRef.current?.offsetTop ?? 0) - 1;
      if (window.scrollY > top) window.scrollTo({ top });
    });
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "1:1 인스타그램 수익화 컨설팅", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    } catch {
      // 공유 창을 닫은 경우 등은 무시
    }
  }

  return (
    <div className="min-h-screen bg-white pb-28 text-neutral-900">
      {/* 상단: 상품 이미지 + 가격 */}
      <div className="relative mx-auto max-w-[1180px] lg:grid lg:grid-cols-2 lg:gap-24 lg:px-[100px] lg:pt-[72px]">
        <Link
          href="/361"
          aria-label="닫기"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black active:scale-95 lg:right-6 lg:top-6 lg:bg-transparent lg:text-neutral-900"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>

        <div className="relative aspect-square w-full overflow-hidden lg:self-start">
          <Image src="/consulting/product.webp" alt="비토리 대표" fill priority sizes="(min-width: 1024px) 490px, 100vw" className="object-cover" />
        </div>

        <div className="px-5 pt-6 lg:px-0 lg:pt-0">
          <h1 className="text-[17px] font-bold lg:text-2xl">1:1 인스타그램 수익화 컨설팅</h1>
          <p className="mt-1.5 text-[15px] font-medium text-neutral-400 line-through lg:mt-3 lg:text-xl">69,000원</p>
          <p className="mt-1 flex items-baseline gap-2 text-xl lg:mt-2 lg:text-[26px]">
            <span className="font-semibold text-[#ff4a2a]">57%</span>
            <span className="font-medium">30,000원</span>
          </p>

          <div className="mt-8 hidden border-t border-neutral-100 pt-6 lg:block">
            <div className="flex items-center justify-between text-[15px]">
              <span className="flex items-center gap-2 font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <rect width="24" height="24" rx="4" fill="#111" />
                  <path d="M6 12.5l4 4 8-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                시간 : 2시간 소요
              </span>
              <span>
                <span className="mr-1.5 text-neutral-400 line-through">69,000원</span>30,000원
              </span>
            </div>
            <div className="mt-10 flex items-center justify-between border-t border-neutral-100 pt-6 text-[15px] font-medium">
              <span>총 상품 금액</span>
              <span className="text-lg">30,000원</span>
            </div>
            <div className="mt-6 flex gap-2.5">
              <a href={APPLY_URL} target="_blank" rel="noreferrer" className={APPLY_BTN}>
                신청하기
              </a>
              <button type="button" onClick={share} aria-label="공유하기" className={SHARE_BTN}>
                <ShareIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div ref={tabsRef} className="sticky top-0 z-20 mt-10 bg-white lg:mt-20">
        <div className="mx-auto flex max-w-[980px] border-b border-neutral-200 px-5" role="tablist">
          <TabButton active={tab === "detail"} onClick={() => openTab("detail")}>
            상품정보
          </TabButton>
          <TabButton active={tab === "reviews"} onClick={() => openTab("reviews")}>
            컨설팅 후기 바로 보러가기
          </TabButton>
        </div>
      </div>

      {tab === "detail" ? (
        <section className="mx-auto max-w-[720px] pt-10">
          {detailImages.map(({ src, height }, i) => (
            <Image
              key={src}
              src={src}
              alt={`1:1 인스타그램 컨설팅 상세 ${i + 1}`}
              width={1080}
              height={height}
              sizes="(min-width: 768px) 720px, 100vw"
              className="block h-auto w-full"
              priority={i === 0}
            />
          ))}

          <div className="mx-5 mt-12 rounded-2xl bg-neutral-50 px-5 py-8 text-center ring-1 ring-neutral-200 md:mx-0">
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
      ) : (
        <section className="mx-auto max-w-[720px] px-5 pt-10 md:px-0">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <h2 className="text-xl font-bold">수강생 후기</h2>
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

          <div className="mt-10 flex flex-col gap-4">
            {consultingReviewImages.map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                width={1080}
                height={3000}
                sizes="(min-width: 768px) 720px, 100vw"
                className="block h-auto w-full rounded-xl"
              />
            ))}
          </div>
        </section>
      )}

      {/* 하단 고정 신청 바 */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-100 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[720px] gap-2.5 px-2.5 py-2.5">
          <button type="button" onClick={share} aria-label="공유하기" className={SHARE_BTN}>
            <ShareIcon />
          </button>
          <a href={APPLY_URL} target="_blank" rel="noreferrer" className={APPLY_BTN}>
            신청하기
          </a>
        </div>
      </div>
      {/* PC: 스크롤 중에도 신청할 수 있도록 오른쪽 아래 고정 */}
      <div className="fixed bottom-6 left-1/2 z-30 hidden w-[480px] -translate-x-1/2 gap-2.5 lg:flex">
        <a href={APPLY_URL} target="_blank" rel="noreferrer" className={`${APPLY_BTN} shadow-[0_12px_30px_rgba(0,0,0,0.35)] ring-2 ring-white`}>
          1:1 컨설팅 신청하기
        </a>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white">
          링크가 복사됐어요
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative flex h-14 flex-1 items-center justify-center whitespace-nowrap text-[min(3.9vw,16px)] transition-colors focus:outline-none focus-visible:bg-neutral-50 ${
        active ? "font-bold text-neutral-900" : "font-medium text-neutral-500 hover:text-neutral-800"
      }`}
    >
      {children}
      {active && <span className="absolute inset-x-6 -bottom-px h-0.5 bg-neutral-900" />}
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

function ShareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
    </svg>
  );
}
