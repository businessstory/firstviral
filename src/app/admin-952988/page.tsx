import { getLeads } from "@/lib/supabase";
import { leadMagnetLabel } from "@/lib/lead-magnets";

export default async function AdminPage() {
  const leads = await getLeads();

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = leads.filter((l) => l.created_at.startsWith(today)).length;

  return (
    <section className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="text-xl font-bold text-neutral-900">신청 내역</h1>

      <div className="mt-4 flex gap-6 text-sm text-neutral-500">
        <p>
          전체 <span className="font-bold text-neutral-900">{leads.length}</span>건
        </p>
        <p>
          오늘 <span className="font-bold text-neutral-900">{todayCount}</span>건
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">신청일시</th>
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">이메일</th>
              <th className="px-4 py-3 font-medium">연락처</th>
              <th className="px-4 py-3 font-medium">신청 자료</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-neutral-100">
                <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                  {new Date(lead.created_at).toLocaleString("ko-KR")}
                </td>
                <td className="px-4 py-3 text-neutral-900">{lead.name}</td>
                <td className="px-4 py-3 text-neutral-900">{lead.email}</td>
                <td className="px-4 py-3 text-neutral-900">{lead.phone}</td>
                <td className="px-4 py-3 text-neutral-900">{leadMagnetLabel(lead.lead_magnet)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-neutral-400">아직 신청 내역이 없어요.</p>
        )}
      </div>
    </section>
  );
}
