"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Lead, AuthUser, TrackedAccount } from "@/lib/supabase";
import { leadMagnetLabel } from "@/lib/lead-magnets";
import { categoryLabel } from "@/lib/trends";

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
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const total = leads.length;
  const pending = leads.filter((l) => l.status === "pending").length;
  const done = leads.filter((l) => l.status === "done").length;
  const todayCount = leads.filter((l) => l.created_at.startsWith(today)).length;

  async function toggleStatus(lead: Lead) {
    const nextStatus = lead.status === "pending" ? "done" : "pending";
    setUpdatingId(lead.id);
    try {
      await fetch("/api/lead-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, status: nextStatus }),
      });
      startTransition(() => router.refresh());
    } finally {
      setUpdatingId(null);
    }
  }

  function handleLogout() {
    // Basic Auth는 표준 로그아웃이 없어서, 잘못된 자격증명으로 재요청해 브라우저 캐시를 무효화하는 방식이에요.
    // 브라우저에 따라 동작이 다를 수 있어요 — 확실히 로그아웃하려면 탭/브라우저를 닫아주세요.
    window.location.href = `https://logout:logout@${window.location.host}/admin-952988`;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-950">퍼스트 바이럴 관리자</h1>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button
            type="button"
            onClick={() => startTransition(() => router.refresh())}
            disabled={isPending}
            className="flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-brand-700 disabled:opacity-50"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            새로고침
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="text-neutral-500 transition-colors hover:text-brand-700"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="전체 신청" value={total} valueClassName="text-brand-950" />
        <StatCard label="대기 중" value={pending} valueClassName="text-accent-gold" />
        <StatCard label="완료" value={done} valueClassName="text-brand-600" />
        <StatCard label="오늘 신청" value={todayCount} valueClassName="text-brand-800" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-bold text-brand-950">회원가입 사용자 ({users.length}명)</h2>
        </div>
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
              {users.map((u) => (
                <tr key={u.id} className="border-t border-neutral-100">
                  <td className="px-5 py-3 font-medium text-neutral-900">{u.email}</td>
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
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-bold text-brand-950">
            추적 계정 목록 ({trackedAccounts.length}개)
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            팔로워 1만 이상, 카테고리별 인기 콘텐츠 추적 대상 계정
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">카테고리</th>
                <th className="px-5 py-3 font-medium">계정</th>
                <th className="px-5 py-3 font-medium">팔로워</th>
                <th className="px-5 py-3 font-medium">발굴일</th>
              </tr>
            </thead>
            <tbody>
              {trackedAccounts.map((acc) => (
                <tr key={acc.id} className="border-t border-neutral-100">
                  <td className="px-5 py-3 text-neutral-600">{categoryLabel(acc.category)}</td>
                  <td className="px-5 py-3 font-medium text-neutral-900">
                    <a
                      href={`https://www.instagram.com/${acc.username}/`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-brand-700"
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
                </tr>
              ))}
            </tbody>
          </table>
          {trackedAccounts.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-neutral-400">
              아직 발굴된 계정이 없어요.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-bold text-brand-950">신청 목록</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">이름</th>
                <th className="px-5 py-3 font-medium">이메일</th>
                <th className="px-5 py-3 font-medium">연락처</th>
                <th className="px-5 py-3 font-medium">신청 자료</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium">접수일</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-neutral-100">
                  <td className="px-5 py-3 font-medium text-neutral-900">{lead.name}</td>
                  <td className="px-5 py-3 text-neutral-600">{lead.email}</td>
                  <td className="px-5 py-3 text-neutral-600">{lead.phone}</td>
                  <td className="px-5 py-3 text-neutral-600">{leadMagnetLabel(lead.lead_magnet)}</td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => toggleStatus(lead)}
                      disabled={updatingId === lead.id}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40 ${
                        lead.status === "done"
                          ? "bg-brand-100 text-brand-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {lead.status === "done" ? "완료" : "대기 중"}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-neutral-500">
                    {new Date(lead.created_at).toLocaleString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {leads.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-neutral-400">아직 신청 내역이 없어요.</p>
          )}
        </div>
      </div>
    </section>
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
