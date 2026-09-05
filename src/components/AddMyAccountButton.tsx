"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { TREND_CATEGORIES } from "@/lib/trends";
import { getSession } from "@/lib/auth";

export default function AddMyAccountButton({ defaultCategory }: { defaultCategory: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(defaultCategory);
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;

    const session = getSession();
    if (!session) {
      setMessage("로그인이 필요해요.");
      return;
    }

    setBusy(true);
    setMessage("계정을 등록하고 있어요...");
    try {
      const startRes = await fetch("/api/add-my-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ category, username }),
      });
      if (!startRes.ok) {
        setMessage("등록에 실패했어요. 다시 시도해주세요.");
        return;
      }

      setMessage("인스타그램에서 콘텐츠를 가져오는 중이에요. 잠시만 기다려주세요 (약 1분)...");
      await new Promise((resolve) => setTimeout(resolve, 75000));

      const collectRes = await fetch("/api/cron/collect-trends", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!collectRes.ok) {
        setMessage("결과를 가져오지 못했어요. 잠시 후 다시 새로고침해주세요.");
        return;
      }

      setMessage("완료! 인기 콘텐츠에 반영됐어요.");
      setUsername("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
      >
        + 내 릴스도 트렌드인지 확인하기
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-brand-100 bg-brand-50 p-3"
    >
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
      >
        {TREND_CATEGORIES.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="내 인스타그램 아이디 (@없이)"
        className="min-w-[180px] flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 disabled:opacity-50"
      >
        {busy ? "적용 중..." : "추가"}
      </button>
      {!busy && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-medium text-neutral-400 hover:text-neutral-600"
        >
          닫기
        </button>
      )}
      {message && <p className="w-full text-xs font-medium text-brand-700">{message}</p>}
    </form>
  );
}
