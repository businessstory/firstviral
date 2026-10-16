import Link from "next/link";
import { getNewsletterPosts } from "@/lib/supabase";
import { newsletterPosts as legacyPosts } from "@/data/newsletter-posts";
import Tag from "@/components/Tag";
import PageTitle from "@/components/PageTitle";

export const revalidate = 300;

export default async function NewsletterPage() {
  const dbPosts = await getNewsletterPosts();

  const items = [
    ...dbPosts.map((p) => ({
      id: p.id,
      title: p.title,
      thumbnail: p.thumbnail_url ?? "https://placehold.co/400x300/0b2b21/ffffff?text=Business+Story",
      date: new Date(p.published_at).toLocaleDateString("ko-KR").replaceAll(". ", ".").replace(/\.$/, ""),
      url: `/48/${p.id}`,
      sortAt: p.published_at,
    })),
    ...legacyPosts.map((p) => ({ ...p, sortAt: p.date })),
  ].sort((a, b) => (a.sortAt < b.sortAt ? 1 : -1));

  return (
    <>
    <PageTitle eyebrow="COLUMN" title="비토리 칼럼" desc="매주 인사이트를 전해드려요." />
    <section className="bg-brand-50">
      <div className="mx-auto grid max-w-6xl gap-5 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((post, i) => {
          const internal = post.url.startsWith("/");
          const Card = (
            <>
              <div className="h-full rounded-[18px] bg-white p-4 transition-transform group-hover:-translate-y-0.5">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-brand-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/5 to-transparent" />
                <span className="absolute inset-x-4 top-4 line-clamp-2 text-lg font-semibold leading-[1.2] text-white">
                  {post.title}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {i === 0 && <Tag tone="new">New</Tag>}
                <Tag>비토리 칼럼</Tag>
              </div>
              <h2 className="mt-2 line-clamp-2 text-balance text-[17px] font-semibold leading-snug text-brand-950">
                {post.title}
              </h2>
              <p className="mt-2 text-[13px] text-ink-muted">{post.date}</p>
              </div>
            </>
          );

          return internal ? (
            <Link key={post.id} href={post.url} className="group block h-full rounded-[18px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              {Card}
            </Link>
          ) : (
            <a key={post.id} href={post.url} target="_blank" rel="noreferrer" className="group block h-full rounded-[18px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              {Card}
            </a>
          );
        })}
      </div>

      {items.length === 0 && (
        <p className="pb-20 text-center text-sm text-ink-muted">아직 등록된 칼럼이 없어요.</p>
      )}
    </section>
    </>
  );
}
