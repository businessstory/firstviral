import Link from "next/link";
import { getCardNewsList } from "@/lib/supabase";

export const metadata = {
  title: "카드뉴스 | 퍼스트 바이럴",
  description: "인스타그램·쓰레드 마케팅 관련 소식과 인사이트를 전해드려요.",
};

export const revalidate = 300;

export default async function CardNewsListPage() {
  const posts = await getCardNewsList();

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-neutral-900 md:text-3xl">카드뉴스</h1>
        <p className="mt-3 text-sm text-neutral-500">퍼스트 바이럴의 소식과 인사이트</p>
      </div>

      <div className="mt-12 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/card-news/${post.id}`}
            className="flex gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-0.5"
          >
            {post.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
            )}
            <div>
              <p className="font-bold text-neutral-900">{post.title}</p>
              <p className="mt-1 text-xs text-neutral-400">
                {new Date(post.published_at).toLocaleDateString("ko-KR")}
              </p>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="py-20 text-center text-sm text-neutral-400">아직 등록된 글이 없어요.</p>
        )}
      </div>
    </section>
  );
}
