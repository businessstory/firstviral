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
            className="relative w-full max-w-sm overflow-hidden rounded-[18px] bg-white text-center"
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

            <div className="bg-brand-900 px-6 pb-7 pt-9 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-200 ring-1 ring-white/15">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                다운로드를 시작했어요
              </span>
              <h2 id="download-popup-title" className="mt-4 text-[22px] font-semibold leading-snug">
                콘텐츠로
                <br />
                <span className="text-brand-400">수익화</span> 하고 싶다면?
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
                className="press flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-brand-700 text-[17px] text-white hover:bg-brand-800 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
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
