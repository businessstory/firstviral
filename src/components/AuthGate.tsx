"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setLoggedIn(!!getSession());
    check();
    window.addEventListener("fv-auth-change", check);
    return () => window.removeEventListener("fv-auth-change", check);
  }, []);

  if (loggedIn === null) return null;

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-black/5 bg-white px-6 py-20 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </span>
        <p className="mt-4 text-sm font-bold text-neutral-900">로그인이 필요한 콘텐츠예요</p>
        <p className="mt-1 text-xs text-neutral-500">로그인하고 인기 콘텐츠를 확인해보세요</p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-800 active:scale-95"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
