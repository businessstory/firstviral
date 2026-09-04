"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^01[016789]-\d{3,4}-\d{4}$/;

function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length < 11) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

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
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (!open) return null;

  const emailValid = EMAIL_RE.test(email);
  const phoneValid = PHONE_RE.test(phone);
  const canSubmit =
    name.trim().length > 0 && emailValid && phoneValid && agreePrivacy && agreeMarketing;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          leadMagnet,
          agreePrivacy,
          agreeMarketing,
        }),
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
    setAgreePrivacy(false);
    setAgreeMarketing(false);
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
              <div>
                <input
                  type="email"
                  required
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
                {email.length > 0 && !emailValid && (
                  <p className="mt-1 text-[11px] text-rose-500">이메일 형식이 올바르지 않아요.</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  required
                  placeholder="연락처 (010-0000-0000)"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
                {phone.length > 0 && !phoneValid && (
                  <p className="mt-1 text-[11px] text-rose-500">연락처 형식이 올바르지 않아요.</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label className="flex items-start gap-2 text-xs text-neutral-500">
                <input
                  type="checkbox"
                  required
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  (필수){" "}
                  <a href="/privacy" target="_blank" className="underline hover:text-brand-700">
                    개인정보 수집 및 이용
                  </a>
                  에 동의합니다.
                </span>
              </label>
              <label className="flex items-start gap-2 text-xs text-neutral-500">
                <input
                  type="checkbox"
                  required
                  checked={agreeMarketing}
                  onChange={(e) => setAgreeMarketing(e.target.checked)}
                  className="mt-0.5"
                />
                <span>(필수) 광고성 정보 수신에 동의합니다.</span>
              </label>
            </div>

            {status === "error" && (
              <p className="mt-3 text-xs text-rose-500">
                신청 중 오류가 발생했어요. 다시 시도해주세요.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !canSubmit}
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
