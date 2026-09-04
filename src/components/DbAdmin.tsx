"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { Lead } from "@/lib/supabase";
import { leadMagnetLabel } from "@/lib/lead-magnets";
import { usePagination } from "@/lib/usePagination";
import AdminShell from "./AdminShell";
import Pagination from "./Pagination";

function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length < 11) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function DbAdmin({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { pageItems, page, setPage, totalPages } = usePagination(leads);

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

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          leadMagnet: "manual",
          agreePrivacy: true,
          agreeMarketing: true,
        }),
      });
      if (!res.ok) {
        setError("추가에 실패했어요. 이메일 형식을 확인해주세요.");
        return;
      }
      setName("");
      setEmail("");
      setPhone("");
      startTransition(() => router.refresh());
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("이 개인정보를 삭제할까요? 되돌릴 수 없어요.")) return;
    setDeletingId(id);
    try {
      await fetch("/api/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      startTransition(() => router.refresh());
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell title="DB">
      <p className="text-sm text-neutral-500">
        수집된 개인정보 전체 목록이에요. 총 <span className="font-bold text-brand-700">{leads.length}건</span>
      </p>

      <form
        onSubmit={handleAdd}
        className="mt-6 flex flex-wrap items-end gap-2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label className="text-[11px] font-bold text-neutral-500">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className="mt-1 w-28 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-neutral-500">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="mt-1 w-52 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-neutral-500">연락처</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
            className="mt-1 w-36 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:opacity-50"
        >
          추가
        </button>
        {error && <p className="w-full text-xs text-red-500">{error}</p>}
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">이름</th>
                <th className="px-5 py-3 font-medium">이메일</th>
                <th className="px-5 py-3 font-medium">연락처</th>
                <th className="px-5 py-3 font-medium">신청 자료</th>
                <th className="px-5 py-3 font-medium">개인정보 동의</th>
                <th className="px-5 py-3 font-medium">광고 수신 동의</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium">접수일</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((lead) => (
                <tr key={lead.id} className="border-t border-neutral-100 hover:bg-neutral-50/60">
                  <td className="px-5 py-3 font-medium text-neutral-900">{lead.name}</td>
                  <td className="px-5 py-3 text-neutral-600">{lead.email}</td>
                  <td className="px-5 py-3 text-neutral-600">{lead.phone}</td>
                  <td className="px-5 py-3 text-neutral-600">{leadMagnetLabel(lead.lead_magnet)}</td>
                  <td className="px-5 py-3">
                    <ConsentBadge agreed={lead.agree_privacy} />
                  </td>
                  <td className="px-5 py-3">
                    <ConsentBadge agreed={lead.agree_marketing} />
                  </td>
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
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id)}
                      disabled={deletingId === lead.id}
                      className="text-xs font-medium text-neutral-400 transition-colors hover:text-red-500 disabled:opacity-40"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && (
            <p className="px-5 py-14 text-center text-sm text-neutral-400">아직 수집된 개인정보가 없어요.</p>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </AdminShell>
  );
}

function ConsentBadge({ agreed }: { agreed: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        agreed ? "bg-brand-100 text-brand-700" : "bg-neutral-100 text-neutral-400"
      }`}
    >
      {agreed ? "동의" : "미동의"}
    </span>
  );
}
