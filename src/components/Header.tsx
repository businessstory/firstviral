"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AccountMenu from "./AccountMenu";

const navItems = [
  { label: "무료 자료실", href: "/261" },
  { label: "뉴스레터", href: "/48" },
  { label: "수강생 후기", href: "/39" },
  { label: "클래스", href: "/361" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="relative h-9 w-[130px] shrink-0">
          <Image
            src="/brand/logo.png"
            alt="퍼스트 바이럴"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-brand-700 ${
                  active ? "text-brand-700" : "text-neutral-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <AccountMenu />
          <button
            aria-label="메뉴 열기"
            className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 bg-white px-5 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-1 flex gap-1 border-t border-black/5 pt-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-md px-2 py-2 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-md px-2 py-2 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              회원가입
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
