"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { consultingReviews } from "@/data/consulting-reviews";

const APPLY_URL = "https://open.kakao.com/o/sJy1y4Qi";

// 상세페이지 이미지 (위에서부터 순서대로 노출, 모두 가로 1080px)
const detailImages: { src: string; height: number; animated?: boolean }[] = [
  { src: "/consulting/v2/01.webp", height: 3000 },
  { src: "/consulting/v2/02.webp", height: 3000 },
  { src: "/consulting/v2/03.webp", height: 3000 },
  { src: "/consulting/v2/04.webp", height: 3000 },
  // 4번과 5번 사이: 컨설팅 성과 모음 (움직이는 이미지)
  { src: "/consulting/v2/results.webp", height: 1080, animated: true },
  { src: "/consulting/v2/05.webp", height: 3000 },
  { src: "/consulting/v2/06.webp", height: 3000 },
  { src: "/consulting/v2/07.webp", height: 3000 },
  { src: "/consulting/v2/08.webp", height: 3000 },
  { src: "/consulting/v2/09.webp", height: 3000 },
  { src: "/consulting/v2/10.webp", height: 3000 },
  { src: "/consulting/v2/11.webp", height: 3000 },
  { src: "/consulting/v2/12.webp", height: 3000 },
  { src: "/consulting/v2/13.webp", height: 3000 },
  { src: "/consulting/v2/14.webp", height: 3000 },
  { src: "/consulting/v2/15.webp", height: 3000 },
  { src: "/consulting/v2/16.webp", height: 3000 },
  { src: "/consulting/v2/17.webp", height: 3000 },
  { src: "/consulting/v2/18.webp", height: 3000 },
  { src: "/consulting/v2/19.webp", height: 3000 },
  { src: "/consulting/v2/20.webp", height: 3000 },
  { src: "/consulting/v2/21.webp", height: 3000 },
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

// 신청하면 함께 드리는 구성: PDF 3종 + 1:1 컨설팅
const BENEFITS = [
  { key: "consult", title: "1:1 맞춤 인스타그램 컨설팅 (2시간)", desc: "내 계정을 직접 보고 수익화 방향을 잡아 드려요 · 오프라인 / ZOOM", icon: "chat" },
  { key: "pdf1", title: "10만 팔로워를 위한 인스타그램 성공공식 PDF", desc: "계정 콘셉트부터 팔로워가 쌓이는 구조까지", icon: "book" },
  { key: "pdf2", title: "인스타그램 AI 프롬프트 자동화 PDF + AI 5종", desc: "주제·원고·후킹·캐러셀·릴스를 복사해서 바로", icon: "spark" },
  { key: "pdf3", title: "캐러셀로 100만 뷰 A–Z PDF", desc: "기획·구성·디자인·업로드까지 한 권으로", icon: "film" },
] as const;

function BenefitIcon({ name, size = 22 }: { name: (typeof BENEFITS)[number]["icon"]; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "chat") return <svg {...common}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M8.5 11h7M8.5 14h4" /></svg>;
  if (name === "book") return <svg {...common}><path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M8 7h7M8 11h5" /></svg>;
  if (name === "film") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M10 9.5l4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none" /></svg>;
  return <svg {...common}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" /></svg>;
}

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
      <p className="flex items-center gap-2 text-[17px] font-bold">
        구성
        <span className="rounded-full bg-[#ff4a2a] px-2 py-0.5 text-[11px] font-bold text-white">PDF 3종 + 컨설팅</span>
      </p>
      <ul className="mt-4 space-y-2.5 rounded-lg border-2 border-[#4b4ef0] bg-[#f3f4ff] p-4">
        {BENEFITS.map((b) => (
          <li key={b.key} className="flex items-start gap-2.5 text-balance text-[14px] font-semibold leading-snug">
            <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <circle cx="12" cy="12" r="11" fill="#4b4ef0" />
              <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {b.title}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-5">
        <span className="text-[15px] font-bold">최종 결제금액</span>
        <span className="text-right">
          <span className="block text-sm text-neutral-400 line-through">69,000원</span>
          <span className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#ff4a2a]">57%</span>
            <span className="text-2xl font-extrabold" style={{ color: ACCENT }}>30,000원</span>
          </span>
        </span>
      </div>
      <a href={APPLY_URL} target="_blank" rel="noreferrer" className={`mt-5 ${APPLY_BTN}`}>
        PDF 3종 + 컨설팅 신청하기
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-28 text-neutral-900 lg:pb-20">
      {/* 상단 바 */}
      <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-5">
        <Link href="/" className="relative h-9 w-[107px]" aria-label="비즈니스 스토리 홈">
          <Image src="/brand/logo-stacked.png" alt="비즈니스 스토리" fill sizes="110px" className="object-contain object-left" />
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

          {/* 구성: PDF 3종 + 1:1 컨설팅 */}
          <section className="mt-10 overflow-hidden rounded-2xl p-6 text-white shadow-[0_16px_40px_rgba(30,32,120,0.25)] md:p-8" style={{ background: "radial-gradient(circle at 85% 0%, #5b5ef5 0%, #2b2d9e 45%, #15164f 100%)" }}>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/25">지금 신청하면</p>
            <h2 className="mt-3 text-[min(6vw,30px)] font-extrabold leading-snug tracking-tight">
              <span className="block whitespace-nowrap">PDF 3종 + 1:1 컨설팅을</span>
              <span className="block whitespace-nowrap"><span className="text-[#ffd84d]">30,000원</span>에 모두 드려요</span>
            </h2>
            <ol className="mt-6 grid gap-3 md:grid-cols-2">
              {BENEFITS.map((b, i) => (
                <li key={b.key} className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3b3ee0]">
                      <BenefitIcon name={b.icon} />
                    </span>
                    <span className="text-xs font-bold text-[#ffd84d]">{b.key === "consult" ? "1:1 컨설팅" : `PDF ${i}`}</span>
                  </div>
                  <p className="mt-3 text-balance text-[16px] font-bold leading-snug">{b.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">{b.desc}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-center text-[13px] text-white/70">
              정가 <span className="line-through">69,000원</span> → <b className="text-white">30,000원</b> · PDF 3종은 신청 후 카카오톡으로 보내 드려요
            </p>
          </section>

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
                  <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-700">{r.summary}</span>
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
            {detailImages.map(({ src, height, animated }, i) => (
              <Image
                key={src}
                src={src}
                alt={animated ? "컨설팅 성과 모음" : `인스타그램 PDF 3종 및 컨설팅 상세 ${i + 1}`}
                width={1080}
                height={height}
                sizes="(min-width: 1024px) 720px, 100vw"
                // 움직이는 이미지는 최적화(정지 이미지 변환) 없이 그대로 보여준다
                unoptimized={animated}
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

            {/* 마지막 안내 + 신청 버튼 */}
            <div className="mt-8 overflow-hidden rounded-2xl px-6 py-10 text-center text-white shadow-[0_16px_40px_rgba(30,32,120,0.25)]" style={{ background: "radial-gradient(circle at 50% 0%, #5b5ef5 0%, #2b2d9e 50%, #15164f 100%)" }}>
              <p className="text-[min(5.4vw,24px)] font-extrabold leading-[1.55] tracking-tight">
                <Nowrap>11월 5일부터 3분 구매할 때마다</Nowrap>
                <Nowrap>
                  총비용이 <span className="text-[#ffd84d]">10,000원씩 증가</span>합니다
                </Nowrap>
              </p>
              <p className="mt-5 text-[min(4.4vw,18px)] font-semibold leading-relaxed text-white/85">
                <Nowrap>지금이 가장 저렴하니까</Nowrap>
                <Nowrap>기회 놓쳐서 후회하지 말고..</Nowrap>
                <Nowrap className="mt-1 text-white">지금 바로 신청하세요!</Nowrap>
              </p>
              <p className="mt-5 text-[min(3.9vw,16px)] leading-relaxed text-white/75">
                <Nowrap>오픈채팅방으로 문의 주시면</Nowrap>
                <Nowrap>제가 연락드릴게요!</Nowrap>
              </p>
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-8 flex h-14 w-full max-w-md items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#ffd84d] px-5 text-[min(4.2vw,17px)] font-extrabold text-[#15164f] shadow-[0_10px_24px_rgba(255,216,77,0.35)] transition-transform hover:scale-[1.02] hover:bg-[#ffe27a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b2d9e] active:scale-[0.98]"
              >
                인스타그램 PDF 3종 및 컨설팅 신청하기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </a>
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
                <ReviewItem key={i} name={r.name} date={r.date} summary={r.summary} text={r.text} />
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
        인스타그램 PDF 3종 + 1:1 맞춤 컨설팅(2시간)을 한 번에 받아 가세요.
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

function Nowrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`block whitespace-nowrap ${className}`}>{children}</span>;
}

function ReviewItem({ name, date, summary, text }: { name: string; date?: string; summary: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="flex gap-4 py-6">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[15px] font-semibold text-neutral-600">
        {name[0]}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[15px] font-semibold">{name}</span>
          {date && <span className="text-[13px] text-neutral-500">{date}</span>}
        </div>
        {open ? (
          <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-neutral-800">{text}</p>
        ) : (
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-neutral-800">{summary}</p>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-2.5 inline-flex items-center gap-1 rounded text-sm font-semibold text-[#4a5cf0] transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a5cf0] active:opacity-50"
        >
          {open ? "접기" : "전체 후기 보기"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={open ? "-rotate-90" : ""} aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </li>
  );
}
