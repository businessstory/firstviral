"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const TABS = [
  { label: "대시보드", href: "/admin-952988" },
  { label: "DB", href: "/admin-952988/db" },
  { label: "100만 뷰 PDF", href: "/admin-952988/pdf-applications" },
  { label: "회원", href: "/admin-952988/members" },
  { label: "뉴스레터", href: "/admin-952988/newsletter" },
  { label: "이메일 발송", href: "/admin-952988/broadcast" },
];

export default function AdminShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  function handleLogout() {
    // Basic Auth는 표준 로그아웃이 없어서, 잘못된 자격증명으로 재요청해 브라우저 캐시를 무효화하는 방식이에요.
    window.location.href = `https://logout:logout@${window.location.host}/admin-952988`;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-8">
            <span className="text-base font-extrabold tracking-tight text-brand-950">
              퍼스트 바이럴 <span className="text-brand-600">관리자</span>
            </span>
            <nav className="hidden items-center gap-1 sm:flex">
              {TABS.map((tab) => {
                const active = pathname === tab.href;
                return (
                  <a
                    key={tab.href}
                    href={tab.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-brand-700 text-white"
                        : "text-neutral-500 hover:bg-brand-50 hover:text-brand-700"
                    }`}
                  >
                    {tab.label}
                  </a>
                );
              })}
            </nav>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-neutral-400 transition-colors hover:text-red-500"
          >
            로그아웃
          </button>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto px-5 pb-3 sm:hidden">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <a
                key={tab.href}
                href={tab.href}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? "bg-brand-700 text-white" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-neutral-900">{title}</h1>
          {actions}
        </div>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
