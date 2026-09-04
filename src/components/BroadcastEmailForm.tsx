"use client";

import { useState, type FormEvent } from "react";
import AdminShell from "./AdminShell";

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
    <AdminShell title="이메일 발송">
      <p className="text-sm text-neutral-500">
        현재 신청자 + 회원가입자 이메일 총{" "}
        <span className="font-bold text-brand-700">{recipientCount}명</span>에게 발송돼요.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-2xl space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-xs font-bold text-neutral-500">제목</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="메일 제목"
            className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-neutral-500">내용</label>
          <p className="mt-1 text-[11px] text-neutral-400">
            링크(https://...)를 붙여넣으면 자동으로 클릭 가능한 링크가 돼요.
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="메일 내용을 입력하세요."
            className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        {result && <p className="text-xs font-medium text-brand-700">{result}</p>}
        <button
          type="submit"
          disabled={busy || recipientCount === 0}
          className="rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:opacity-50"
        >
          {busy ? "발송 중..." : "전체 발송"}
        </button>
      </form>
    </AdminShell>
  );
}
