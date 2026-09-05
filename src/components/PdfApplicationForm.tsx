"use client";

import { useState } from "react";

const PHONE_RE = /^01[016789]-\d{3,4}-\d{4}$/;

function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length < 11) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function PdfApplicationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const phoneValid = PHONE_RE.test(phone);
  const canSubmit = name.trim().length > 0 && phoneValid && reason.trim().length > 0 && agree;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/pdf-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, reason, agreePrivacy: agree }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
        <p className="text-lg font-bold text-neutral-900">신청 완료!</p>
        <p className="mt-2 text-sm text-neutral-600">
          작성해주신 연락처로 곧 PDF 소책자를 보내드릴게요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-neutral-900">😎 이름</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-neutral-900">😎 연락처</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="010-1234-1234"
              className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <p className="mt-1 text-[11px] text-neutral-400">연락처로 책자가 발송됩니다</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-900">
            😎 PDF를 신청하게 된 이유는 무엇인가요?
          </label>
          <p className="mt-1 text-[11px] text-neutral-400">
            나의 현재상황, 고민, 문제점, 도움이 필요한 부분... (상세히 작성할수록 많은 도움을 받을 수 있습니다)
          </p>
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <label className="flex items-start gap-2 rounded-xl bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-500">
          <input
            type="checkbox"
            required
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span>
            <strong className="text-neutral-700">개인정보 수집 이용 동의</strong>
            <br />
            본인은 개인정보 수집 및 이용안내 동의하며, 필독서 PDF의 소책자를 신청합니다.
            <br />- 개인정보 항목: 이름, 핸드폰, 이메일주소
            <br />- 이용목적: 본인 식별, 강의 안내, 정보 전달 등에 이용
            <br />- 제공 정보의 보유 및 이용 기간: 제공일로부터 3년
          </span>
        </label>

        {status === "error" && (
          <p className="text-xs text-rose-500">신청 중 오류가 발생했어요. 다시 시도해주세요.</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || status === "loading"}
          className="w-full rounded-full bg-brand-700 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "신청 중..." : "무료로 PDF 신청하기"}
        </button>
      </div>
    </form>
  );
}
