import Link from "next/link";
import { getNewsletterPosts } from "@/lib/supabase";
import { newsletterPosts as legacyPosts } from "@/data/newsletter-posts";
import Tag from "@/components/Tag";

export const revalidate = 300;

export default async function NewsletterPage() {
  const dbPosts = await getNewsletterPosts();

  const items = [
    ...dbPosts.map((p) => ({
      id: p.id,
      title: p.title,
      thumbnail: p.thumbnail_url ?? "https://placehold.co/400x300/0b2b21/ffffff?text=First+Viral",
      date: new Date(p.published_at).toLocaleDateString("ko-KR").replaceAll(". ", ".").replace(/\.$/, ""),
      url: `/48/${p.id}`,
      sortAt: p.published_at,
    })),
    ...legacyPosts.map((p) => ({ ...p, sortAt: p.date })),
  ].sort((a, b) => (a.sortAt < b.sortAt ? 1 : -1));

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-xl font-extrabold text-neutral-900 md:text-2xl">뉴스레터</h1>
      <p className="mt-2 text-sm text-neutral-500">매주 인사이트를 전해드려요.</p>

      <div className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((post, i) => {
          const internal = post.url.startsWith("/");
          const Card = (
            <>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/5 to-transparent" />
                <span className="absolute inset-x-4 top-4 line-clamp-2 text-lg font-black leading-[1.2] text-white">
                  {post.title}
                </span>
              </div>
              <h2 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-neutral-900">
                {post.title}
              </h2>
              <div className="mt-2 flex items-center gap-1.5">
                <Tag>뉴스레터</Tag>
                {i === 0 && <Tag tone="new">New</Tag>}
              </div>
              <p className="mt-2 text-xs text-neutral-400">{post.date}</p>
            </>
          );

          return internal ? (
            <Link key={post.id} href={post.url} className="group block">
              {Card}
            </Link>
          ) : (
            <a key={post.id} href={post.url} target="_blank" rel="noreferrer" className="group block">
              {Card}
            </a>
          );
        })}
      </div>

      {items.length === 0 && (
        <p className="mt-20 text-center text-sm text-neutral-400">아직 등록된 뉴스레터가 없어요.</p>
      )}
    </section>
  );
}
