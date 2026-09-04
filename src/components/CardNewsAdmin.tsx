"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { CardNews } from "@/lib/supabase";

export default function CardNewsAdmin({ posts }: { posts: CardNews[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/card-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, coverImageUrl: coverImageUrl || null }),
      });
      if (!res.ok) {
        setError("등록에 실패했어요. 다시 시도해주세요.");
        return;
      }
      setTitle("");
      setCoverImageUrl("");
      setBody("");
      startTransition(() => router.refresh());
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      await fetch("/api/card-news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      startTransition(() => router.refresh());
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-brand-950">카드뉴스 관리</h1>
          <a href="/admin-952988" className="text-sm font-medium text-neutral-500 hover:text-brand-700">
            ← 관리자 홈
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="text-xs font-semibold text-neutral-500">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="글 제목"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-500">
              커버 이미지 URL (선택)
            </label>
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-500">본문</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              placeholder="내용을 입력하세요. 링크(https://...)를 붙여넣으면 자동으로 클릭 가능한 링크가 됩니다."
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:opacity-50"
          >
            게시하기
          </button>
        </form>

        <div className="mt-8 space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4"
            >
              <div>
                <p className="text-sm font-bold text-neutral-900">{post.title}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(post.published_at).toLocaleString("ko-KR")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/card-news/${post.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-brand-700 hover:underline"
                >
                  보기
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  disabled={busy}
                  className="text-xs font-medium text-neutral-400 transition-colors hover:text-red-500 disabled:opacity-40"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="py-10 text-center text-sm text-neutral-400">아직 작성한 글이 없어요.</p>
          )}
        </div>
      </section>
    </div>
  );
}
