"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, signOut, type Session } from "@/lib/auth";

export default function AccountMenu() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSession(getSession());
    const onChange = () => setSession(getSession());
    window.addEventListener("fv-auth-change", onChange);
    return () => window.removeEventListener("fv-auth-change", onChange);
  }, []);

  return (
    <div className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="계정 메뉴"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-neutral-200 bg-white p-2 text-sm shadow-lg">
            {session ? (
              <>
                <p className="truncate px-2 py-1.5 text-xs text-neutral-400">{session.email}</p>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="w-full rounded-lg px-2 py-1.5 text-left text-neutral-700 hover:bg-neutral-50"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-1.5 text-neutral-700 hover:bg-neutral-50"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-1.5 text-neutral-700 hover:bg-neutral-50"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
