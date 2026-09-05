import Link from "next/link";
import { notFound } from "next/navigation";
import { postsBySlug } from "@/data/posts";
import { getNewsletterPostById } from "@/lib/supabase";
import LinkifiedText from "@/components/LinkifiedText";
import InstagramEmbedScript from "@/components/InstagramEmbedScript";

export default async function NewsletterPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dbPost = await getNewsletterPostById(id);
  if (dbPost) {
    return (
      <article className="mx-auto max-w-2xl px-5 py-16">
        <Link href="/48" className="text-xs font-medium text-neutral-400 hover:text-neutral-700">
          ← 뉴스레터 목록
        </Link>
        {dbPost.thumbnail_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dbPost.thumbnail_url}
            alt={dbPost.title}
            className="mt-6 w-full rounded-2xl object-cover"
          />
        )}
        <h1 className="mt-6 text-2xl font-extrabold leading-snug text-neutral-900 md:text-3xl">
          {dbPost.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          {new Date(dbPost.published_at).toLocaleDateString("ko-KR")}
        </p>
        <div className="mt-8 text-sm text-neutral-700">
          <LinkifiedText text={dbPost.body} />
        </div>
        <InstagramEmbedScript />
      </article>
    );
  }

  const post = postsBySlug[id as keyof typeof postsBySlug];
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/48" className="text-xs font-medium text-neutral-400 hover:text-neutral-700">
        ← 뉴스레터 목록
      </Link>

      <h1 className="mt-4 text-2xl font-extrabold leading-snug text-neutral-900 md:text-3xl">
        {post.title}
      </h1>
      <p className="mt-2 text-sm text-neutral-400">{post.date}</p>

      <div className="mt-8 flex flex-col gap-4 text-sm leading-relaxed text-neutral-700">
        {post.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-12">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold text-neutral-900">{section.heading}</h2>

            <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs font-semibold text-neutral-500">{section.account}</p>
              <p className="mt-1 text-sm italic text-neutral-600">&ldquo;{section.caption}&rdquo;</p>
              <p className="mt-2 text-[11px] text-neutral-400">instagram.com</p>
            </div>

            <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-neutral-700">
              {section.bullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-neutral-300">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-neutral-100 pt-10 text-sm leading-relaxed text-neutral-700">
        {post.outro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <a
        href={post.ctaUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95"
      >
        {post.ctaLabel}
      </a>
    </article>
  );
}
