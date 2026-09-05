"use client";

import type { AuthUser } from "@/lib/supabase";
import { usePagination } from "@/lib/usePagination";
import AdminShell from "./AdminShell";
import Pagination from "./Pagination";

export default function MembersAdmin({ users }: { users: AuthUser[] }) {
  const { pageItems, page, setPage, totalPages } = usePagination(users);

  return (
    <AdminShell title="회원">
      <p className="text-sm text-neutral-500">
        회원가입한 사용자 목록이에요. 총 <span className="font-bold text-brand-700">{users.length}명</span>
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
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
              {pageItems.map((u) => (
                <tr key={u.id} className="border-t border-neutral-100 hover:bg-neutral-50/60">
                  <td className="max-w-[280px] truncate px-5 py-3 font-medium text-neutral-900" title={u.email}>
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
            <p className="px-5 py-14 text-center text-sm text-neutral-400">아직 가입한 사용자가 없어요.</p>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </AdminShell>
  );
}
