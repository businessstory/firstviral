"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// 무료 자료를 바로 다운로드하면서, 동시에 1:1 컨설팅 안내 팝업을 띄운다.
export default function DownloadWithPopup({
  href,
  filename,
  children,
}: {
  href: string;
  filename: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    ctaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <a
        href={href}
        download={filename}
        onClick={() => setOpen(true)}
        className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4"
      >
        {children}
      </a>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-5"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-popup-title"
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white text-center shadow-[0_24px_60px_rgba(11,43,33,0.35)]"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-transform hover:scale-105 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="bg-brand-950 px-6 pb-7 pt-9 text-white" style={{ background: "radial-gradient(circle at 50% 0%, #1c4f3a, #0b2b21 70%)" }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-200 ring-1 ring-white/15">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                다운로드를 시작했어요
              </span>
              <h2 id="download-popup-title" className="mt-4 text-[22px] font-extrabold leading-snug tracking-tight">
                콘텐츠로
                <br />
                <span className="text-accent-gold">수익화</span> 하고 싶다면?
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-brand-100/80">
                750회 이상 진행한 1:1 인스타그램 컨설팅에서
                <br />내 계정에 맞는 수익화 방향을 잡아 드려요.
              </p>
            </div>

            <div className="px-6 pb-6 pt-5">
              <Link
                ref={ctaRef}
                href="/consulting"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent-gold text-base font-bold text-brand-950 shadow-[0_10px_24px_rgba(232,196,104,0.4)] transition-transform hover:scale-[1.02] hover:bg-[#f0d07c] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                클릭하기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 text-sm font-medium text-neutral-400 underline-offset-2 transition-colors hover:text-neutral-600 hover:underline focus:outline-none focus-visible:text-neutral-700"
              >
                다음에 할게요
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
