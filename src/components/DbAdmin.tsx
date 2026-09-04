"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Lead } from "@/lib/supabase";
import { leadMagnetLabel } from "@/lib/lead-magnets";
import { usePagination } from "@/lib/usePagination";
import AdminShell from "./AdminShell";
import Pagination from "./Pagination";

export default function DbAdmin({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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

  return (
    <AdminShell title="DB">
      <p className="text-sm text-neutral-500">
        수집된 개인정보 전체 목록이에요. 총 <span className="font-bold text-brand-700">{leads.length}건</span>
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
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
