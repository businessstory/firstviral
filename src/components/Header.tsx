"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AccountMenu from "./AccountMenu";

const navItems = [
  { label: "무료 자료실", href: "/261" },
  { label: "수강생 후기", href: "/39" },
  { label: "릴스 트렌드", href: "/trends" },
  { label: "비토리 칼럼", href: "/48" },
  { label: "컨설팅 신청", href: "/361" },
];

const ICON_LINK =
  "flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

// 애플 global-nav: 얇은 검정 바, 흰 글씨, 링크는 조용하게
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="비즈니스 스토리 홈" className="relative h-7 w-[84px] shrink-0">
          <Image src="/brand/logo-stacked-white.png" alt="비즈니스 스토리" fill sizes="90px" className="object-contain object-left" priority />
        </Link>

        <nav className="hidden h-full items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-full items-center text-[13px] transition-colors focus:outline-none focus-visible:text-white ${
                  active ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <a href="https://www.instagram.com/_business.story/" target="_blank" rel="noreferrer" aria-label="인스타그램" className={ICON_LINK}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="https://www.youtube.com/@Betory100/featured" target="_blank" rel="noreferrer" aria-label="유튜브" className={ICON_LINK}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
              <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <AccountMenu />
          <button aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open} className={`${ICON_LINK} md:hidden`} onClick={() => setOpen((v) => !v)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-black px-5 pb-6 pt-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/10 py-3.5 text-[17px] font-semibold text-white/90 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex gap-2">
            <Link href="/login" onClick={() => setOpen(false)} className="press flex-1 rounded-full bg-white/10 py-2.5 text-center text-sm text-white">
              로그인
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)} className="press flex-1 rounded-full bg-brand-700 py-2.5 text-center text-sm text-white">
              회원가입
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
