"use client";

import { useMemo, useState, type FormEvent } from "react";
import AdminShell from "./AdminShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNaver(email: string): boolean {
  return email.toLowerCase().endsWith("@naver.com");
}

export default function BroadcastEmailForm({
  dbEmails,
  excelEmails,
}: {
  dbEmails: string[];
  excelEmails: string[];
}) {
  const naverDefault = useMemo(() => {
    const set = new Set<string>();
    dbEmails.filter(isNaver).forEach((e) => set.add(e));
    excelEmails.filter(isNaver).forEach((e) => set.add(e));
    return Array.from(set);
  }, [dbEmails, excelEmails]);

  const [recipientsText, setRecipientsText] = useState(naverDefault.join("\n"));
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const recipients = useMemo(
    () =>
      Array.from(
        new Set(
          recipientsText
            .split(/[\n,]+/)
            .map((e) => e.trim().toLowerCase())
            .filter((e) => EMAIL_RE.test(e))
        )
      ),
    [recipientsText]
  );

  function handleLoadNaverOnly() {
    setRecipientsText(naverDefault.join("\n"));
  }

  function handleLoadAll() {
    setRecipientsText(Array.from(new Set(dbEmails.map((e) => e.toLowerCase()))).join("\n"));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim() || recipients.length === 0) return;

    const confirmed = window.confirm(
      `총 ${recipients.length}명에게 이메일을 보냅니다. 되돌릴 수 없어요. 정말 발송할까요?`
    );
    if (!confirmed) return;

    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/broadcast-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, recipients }),
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
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm text-neutral-500">
            가져온 명단에서 naver.com {excelEmails.filter(isNaver).length}건 + 기존 신청자·회원 중
            naver.com {dbEmails.filter(isNaver).length}건을 합쳐 기본으로 채워뒀어요. 필요하면 아래에서 직접
            수정하세요.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-neutral-500">받는 사람</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleLoadNaverOnly}
                    className="text-xs font-semibold text-brand-700 hover:underline"
                  >
                    네이버만 다시 불러오기 ({naverDefault.length}명)
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadAll}
                    className="text-xs font-semibold text-neutral-400 hover:underline"
                  >
                    전체 신청자+회원 불러오기 ({dbEmails.length}명)
                  </button>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">
                한 줄에 하나씩 또는 쉼표로 구분해서 붙여넣으세요.
              </p>
              <textarea
                value={recipientsText}
                onChange={(e) => setRecipientsText(e.target.value)}
                rows={6}
                placeholder={"example@naver.com\n..."}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <p className="mt-1 text-[11px] font-medium text-brand-700">인식된 이메일: {recipients.length}개</p>
            </div>
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
              disabled={busy || recipients.length === 0}
              className="rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:opacity-50"
            >
              {busy ? "발송 중..." : `${recipients.length}명에게 발송`}
            </button>
          </form>
        </div>

        <div className="h-fit overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-4 py-3">
            <h2 className="text-xs font-bold text-brand-950">
              받는 사람 <span className="font-medium text-neutral-400">({recipients.length})</span>
            </h2>
          </div>
          <ul className="max-h-[420px] divide-y divide-neutral-100 overflow-y-auto">
            {recipients.map((email) => (
              <li key={email} className="truncate px-4 py-2 text-xs text-neutral-600">
                {email}
              </li>
            ))}
            {recipients.length === 0 && (
              <li className="px-4 py-8 text-center text-xs text-neutral-400">받는 사람이 없어요.</li>
            )}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
