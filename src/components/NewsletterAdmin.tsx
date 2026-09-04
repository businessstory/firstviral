"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import type { NewsletterPostRow } from "@/lib/supabase";
import { usePagination } from "@/lib/usePagination";
import AdminShell from "./AdminShell";
import Pagination from "./Pagination";

export default function NewsletterAdmin({ posts }: { posts: NewsletterPostRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { pageItems, page, setPage, totalPages } = usePagination(posts);

  async function handleThumbnailSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError("이미지 업로드에 실패했어요.");
        return;
      }
      setThumbnailUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, thumbnailUrl }),
      });
      if (!res.ok) {
        setError("등록에 실패했어요. 다시 시도해주세요.");
        return;
      }
      setTitle("");
      setThumbnailUrl(null);
      setBody("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      startTransition(() => router.refresh());
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      await fetch("/api/newsletter-posts", {
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
    <AdminShell title="뉴스레터 관리">
      <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-xs font-bold text-neutral-500">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="뉴스레터 제목"
            className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-500">썸네일 이미지</label>
          <p className="mt-1 text-[11px] text-neutral-400">
            권장 크기: 가로 1200px × 세로 900px (4:3 비율). 목록 카드에 딱 맞게 나와요.
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
              className="block w-full text-xs text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
            />
            {uploading && <span className="shrink-0 text-xs text-neutral-400">업로드 중...</span>}
          </div>
          {thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt="썸네일 미리보기"
              className="mt-3 h-32 w-full max-w-xs rounded-xl object-cover"
            />
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-500">본문</label>
          <p className="mt-1 text-[11px] text-neutral-400">
            링크(https://...)를 붙여넣으면 자동으로 클릭 가능한 링크가 돼요.
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="내용을 입력하세요."
            className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy || uploading}
          className="rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:opacity-50"
        >
          {busy ? "게시 중..." : "게시하기"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-bold text-brand-950">작성한 글 ({posts.length}개)</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {pageItems.map((post) => (
            <div key={post.id} className="flex items-center gap-4 px-5 py-4">
              {post.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="h-14 w-14 shrink-0 rounded-lg bg-neutral-100" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-900">{post.title}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(post.published_at).toLocaleString("ko-KR")}
                </p>
              </div>
              <a
                href={`/48/${post.id}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-xs font-semibold text-brand-700 hover:underline"
              >
                보기
              </a>
              <button
                type="button"
                onClick={() => handleDelete(post.id)}
                disabled={busy}
                className="shrink-0 text-xs font-medium text-neutral-400 transition-colors hover:text-red-500 disabled:opacity-40"
              >
                삭제
              </button>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-neutral-400">아직 작성한 글이 없어요.</p>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
      </div>
    </AdminShell>
  );
}
