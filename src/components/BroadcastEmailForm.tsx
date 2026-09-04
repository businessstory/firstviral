"use client";

import { useState, type FormEvent } from "react";

export default function BroadcastEmailForm({ recipientCount }: { recipientCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    const confirmed = window.confirm(
      `총 ${recipientCount}명에게 이메일을 보냅니다. 되돌릴 수 없어요. 정말 발송할까요?`
    );
    if (!confirmed) return;

    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/broadcast-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult("발송에 실패했어요. 다시 시도해주세요.");
        return;
      }
      setResult(`발송 완료: 성공 ${data.sent}건 / 실패 ${data.failed}건 (전체 ${data.total}명)`);
      setSubject("");
      setBody("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-2xl px-5 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-brand-950">이메일 전체 발송</h1>
          <a href="/admin-952988" className="text-sm font-medium text-neutral-500 hover:text-brand-700">
            ← 관리자 홈
          </a>
        </div>
        <p className="mt-2 text-sm text-neutral-500">
          현재 신청자 + 회원가입자 이메일 총{" "}
          <span className="font-bold text-brand-700">{recipientCount}명</span>에게 발송돼요.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="text-xs font-semibold text-neutral-500">제목</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="메일 제목"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-500">내용</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              placeholder="메일 내용을 입력하세요."
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          {result && <p className="text-xs font-medium text-brand-700">{result}</p>}
          <button
            type="submit"
            disabled={busy || recipientCount === 0}
            className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:opacity-50"
          >
            {busy ? "발송 중..." : "전체 발송"}
          </button>
        </form>
      </section>
    </div>
  );
}
