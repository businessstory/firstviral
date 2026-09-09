"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Lead } from "@/lib/supabase";
import AdminShell from "./AdminShell";

export default function BroadcastSmsForm({ leads }: { leads: Lead[] }) {
  const [phonesText, setPhonesText] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const consentedPhones = useMemo(
    () =>
      Array.from(
        new Set(
          leads
            .filter((l) => l.agree_marketing && l.phone)
            .map((l) => l.phone.trim())
        )
      ),
    [leads]
  );

  const phones = useMemo(
    () =>
      Array.from(
        new Set(
          phonesText
            .split(/[\n,]+/)
            .map((p) => p.trim())
            .filter(Boolean)
        )
      ),
    [phonesText]
  );

  function handleLoadConsented() {
    setPhonesText((prev) => {
      const existing = new Set(
        prev
          .split(/[\n,]+/)
          .map((p) => p.trim())
          .filter(Boolean)
      );
      consentedPhones.forEach((p) => existing.add(p));
      return Array.from(existing).join("\n");
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (phones.length === 0 || !message.trim()) return;

    const confirmed = window.confirm(
      `총 ${phones.length}명에게 광고 문자를 보냅니다. 되돌릴 수 없고 비용이 발생해요. 정말 발송할까요?`
    );
    if (!confirmed) return;

    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/broadcast-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phones, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(`발송에 실패했어요 (${data.error ?? "알 수 없는 오류"}). 알리고 설정을 확인해주세요.`);
        return;
      }
      setResult(`발송 완료: 성공 ${data.sent}건 / 실패 ${data.failed}건 (전체 ${data.total}명)`);
      setMessage("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell title="문자 발송">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm text-neutral-500">
            광고성 문자는 발송 시 자동으로 <span className="font-semibold">"(광고)"</span> 표시와{" "}
            <span className="font-semibold">수신거부 안내</span>가 앞뒤에 붙어요 (법적 필수 사항).
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-500">받는 번호</label>
                <button
                  type="button"
                  onClick={handleLoadConsented}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  상담 신청자 중 마케팅 동의자 불러오기 ({consentedPhones.length}명)
                </button>
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">
                한 줄에 하나씩 또는 쉼표로 구분해서 붙여넣으세요.
              </p>
              <textarea
                value={phonesText}
                onChange={(e) => setPhonesText(e.target.value)}
                rows={6}
                placeholder={"01012345678\n01098765432\n..."}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <p className="mt-1 text-[11px] font-medium text-brand-700">인식된 번호: {phones.length}개</p>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500">내용</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="문자 내용을 입력하세요. (광고) 표시와 수신거부 안내는 자동으로 추가돼요."
                className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <p className="mt-1 text-[11px] text-neutral-400">{message.length}자</p>
            </div>
            {result && <p className="text-xs font-medium text-brand-700">{result}</p>}
            <button
              type="submit"
              disabled={busy || phones.length === 0}
              className="rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:opacity-50"
            >
              {busy ? "발송 중..." : `${phones.length}명에게 발송`}
            </button>
          </form>
        </div>

        <div className="h-fit overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-4 py-3">
            <h2 className="text-xs font-bold text-brand-950">
              받는 사람 <span className="font-medium text-neutral-400">({phones.length})</span>
            </h2>
          </div>
          <ul className="max-h-[420px] divide-y divide-neutral-100 overflow-y-auto">
            {phones.map((p) => (
              <li key={p} className="truncate px-4 py-2 text-xs text-neutral-600">
                {p}
              </li>
            ))}
            {phones.length === 0 && (
              <li className="px-4 py-8 text-center text-xs text-neutral-400">받는 사람이 없어요.</li>
            )}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
