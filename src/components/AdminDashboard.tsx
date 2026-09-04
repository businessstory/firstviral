"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import type { Lead, AuthUser, TrackedAccount } from "@/lib/supabase";
import { categoryLabel, TREND_CATEGORIES } from "@/lib/trends";
import { usePagination } from "@/lib/usePagination";
import AdminShell from "./AdminShell";
import Pagination from "./Pagination";

export default function AdminDashboard({
  leads,
  users,
  trackedAccounts,
}: {
  leads: Lead[];
  users: AuthUser[];
  trackedAccounts: TrackedAccount[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newCategory, setNewCategory] = useState<string>(TREND_CATEGORIES[0].key);
  const [newUsername, setNewUsername] = useState("");
  const [accountBusy, setAccountBusy] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const total = leads.length;
  const pending = leads.filter((l) => l.status === "pending").length;
  const done = leads.filter((l) => l.status === "done").length;
  const todayCount = leads.filter((l) => l.created_at.startsWith(today)).length;

  const usersPage = usePagination(users);
  const accountsPage = usePagination(trackedAccounts);

  async function handleAddAccount(e: FormEvent) {
    e.preventDefault();
    if (!newUsername.trim()) return;
    setAccountBusy(true);
    setAccountError(null);
    try {
      const res = await fetch("/api/tracked-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory, username: newUsername }),
      });
      if (!res.ok) {
        setAccountError("추가에 실패했어요. 다시 시도해주세요.");
        return;
      }
      setNewUsername("");
      startTransition(() => router.refresh());
    } finally {
      setAccountBusy(false);
    }
  }

  async function handleDeleteAccount(id: string) {
    setAccountBusy(true);
    try {
      await fetch("/api/tracked-accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      startTransition(() => router.refresh());
    } finally {
      setAccountBusy(false);
    }
  }

  return (
    <AdminShell
      title="대시보드"
      actions={
        <button
          type="button"
          onClick={() => startTransition(() => router.refresh())}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-2 text-xs font-semibold text-neutral-500 transition-colors hover:border-brand-200 hover:text-brand-700 disabled:opacity-50"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          새로고침
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="전체 신청" value={total} valueClassName="text-brand-950" />
        <StatCard label="대기 중" value={pending} valueClassName="text-accent-gold" />
        <StatCard label="완료" value={done} valueClassName="text-brand-600" />
        <StatCard label="오늘 신청" value={todayCount} valueClassName="text-brand-800" />
      </div>

      <Panel title="회원가입 사용자" count={users.length} className="mt-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">이메일</th>
                <th className="px-5 py-3 font-medium">이메일 인증</th>
                <th className="px-5 py-3 font-medium">가입일</th>
              </tr>
            </thead>
            <tbody>
              {usersPage.pageItems.map((u) => (
                <tr key={u.id} className="border-t border-neutral-100 hover:bg-neutral-50/60">
                  <td className="max-w-[240px] truncate px-5 py-3 font-medium text-neutral-900" title={u.email}>
                    {u.email}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        u.email_confirmed_at ? "bg-brand-100 text-brand-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {u.email_confirmed_at ? "인증됨" : "미인증"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-neutral-500">
                    {new Date(u.created_at).toLocaleString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-neutral-400">아직 가입한 사용자가 없어요.</p>
          )}
        </div>
        <Pagination page={usersPage.page} totalPages={usersPage.totalPages} onChange={usersPage.setPage} />
      </Panel>

      <Panel
        title="추적 계정 목록"
        count={trackedAccounts.length}
        subtitle="팔로워 1만 이상, 카테고리별 인기 콘텐츠 추적 대상 계정"
        className="mt-6"
      >
        <form
          onSubmit={handleAddAccount}
          className="flex flex-wrap items-center gap-2 border-b border-neutral-100 px-5 py-4"
        >
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {TREND_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="계정 아이디 (예: @없이 username 또는 인스타그램 링크)"
            className="min-w-[240px] flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button
            type="submit"
            disabled={accountBusy}
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:opacity-50"
          >
            추가
          </button>
          {accountError && <p className="w-full text-xs text-red-500">{accountError}</p>}
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">카테고리</th>
                <th className="px-5 py-3 font-medium">계정</th>
                <th className="px-5 py-3 font-medium">팔로워</th>
                <th className="px-5 py-3 font-medium">발굴일</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {accountsPage.pageItems.map((acc) => (
                <tr key={acc.id} className="border-t border-neutral-100 hover:bg-neutral-50/60">
                  <td className="px-5 py-3 text-neutral-600">{categoryLabel(acc.category)}</td>
                  <td className="max-w-[180px] truncate px-5 py-3 font-medium text-neutral-900">
                    <a
                      href={`https://www.instagram.com/${acc.username}/`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-brand-700"
                      title={acc.username}
                    >
                      @{acc.username}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    {acc.follower_count?.toLocaleString() ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-neutral-500">
                    {new Date(acc.discovered_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteAccount(acc.id)}
                      disabled={accountBusy}
                      className="text-xs font-medium text-neutral-400 transition-colors hover:text-red-500 disabled:opacity-40"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {trackedAccounts.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-neutral-400">아직 발굴된 계정이 없어요.</p>
          )}
        </div>
        <Pagination page={accountsPage.page} totalPages={accountsPage.totalPages} onChange={accountsPage.setPage} />
      </Panel>

      <p className="mt-6 text-center text-xs text-neutral-400">
        신청자 개인정보 전체 목록은{" "}
        <a href="/admin-952988/db" className="font-semibold text-brand-700 hover:underline">
          DB 탭
        </a>
        에서 확인하세요.
      </p>
    </AdminShell>
  );
}

function Panel({
  title,
  count,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  count: number;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-4">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        <h2 className="text-sm font-bold text-brand-950">
          {title} <span className="font-medium text-neutral-400">({count})</span>
        </h2>
      </div>
      {subtitle && <p className="px-5 pt-3 text-xs text-neutral-400">{subtitle}</p>}
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className={`mt-2 text-3xl font-extrabold ${valueClassName}`}>{value}</p>
    </div>
  );
}
