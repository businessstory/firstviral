"use client";

import { useState } from "react";

export default function LeadCaptureModal({
  open,
  onClose,
  leadMagnet,
  title,
}: {
  open: boolean;
  onClose: () => void;
  leadMagnet: string;
  title: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, leadMagnet }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  function handleClose() {
    setStatus("idle");
    setName("");
    setEmail("");
    setPhone("");
    setAgree(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        {status === "done" ? (
          <div className="text-center">
            <p className="text-lg font-bold text-neutral-900">신청 완료!</p>
            <p className="mt-2 text-sm text-neutral-500">
              곧 확인 후 자료를 보내드릴게요.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full rounded-full bg-brand-700 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 active:scale-95"
            >
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold leading-snug text-neutral-900">{title}</h3>
              <button
                type="button"
                onClick={handleClose}
                aria-label="닫기"
                className="text-neutral-400 hover:text-neutral-700"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              이름과 연락처를 남기면 자료를 보내드려요.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <input
                type="email"
                required
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <input
                type="tel"
                required
                placeholder="연락처 (010-0000-0000)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>

            <label className="mt-4 flex items-start gap-2 text-xs text-neutral-500">
              <input
                type="checkbox"
                required
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5"
              />
              {/* TODO: 실제 개인정보 처리방침 페이지로 연결 */}
              자료 발송을 위한 이름/이메일/연락처 수집에 동의합니다.
            </label>

            {status === "error" && (
              <p className="mt-3 text-xs text-rose-500">
                아직 저장 연동 준비 중이에요. 우측 하단 문의 버튼으로 요청해주세요.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !agree}
              className="mt-5 w-full rounded-full bg-brand-700 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "전송 중..." : "무료로 받기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
