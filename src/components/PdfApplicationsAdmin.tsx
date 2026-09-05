"use client";

import type { PdfApplication } from "@/lib/supabase";
import { usePagination } from "@/lib/usePagination";
import AdminShell from "./AdminShell";
import Pagination from "./Pagination";

export default function PdfApplicationsAdmin({ applications }: { applications: PdfApplication[] }) {
  const { pageItems, page, setPage, totalPages } = usePagination(applications);

  return (
    <AdminShell title="100만 뷰 PDF 신청">
      <p className="text-sm text-neutral-500">
        &ldquo;인스타그램 100만 뷰 공식 3가지 PDF&rdquo; 신청자 목록이에요. 총{" "}
        <span className="font-bold text-brand-700">{applications.length}건</span>
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="divide-y divide-neutral-100">
          {pageItems.map((app) => (
            <div key={app.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <p className="font-bold text-neutral-900">{app.name}</p>
                  <p className="text-sm text-neutral-500">{app.phone}</p>
                </div>
                <p className="text-xs text-neutral-400">
                  {new Date(app.created_at).toLocaleString("ko-KR")}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
                {app.reason}
              </p>
            </div>
          ))}
          {applications.length === 0 && (
            <p className="px-5 py-14 text-center text-sm text-neutral-400">아직 신청 내역이 없어요.</p>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </AdminShell>
  );
}
