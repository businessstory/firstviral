import Image from "next/image";
import Link from "next/link";
import { newsletterPosts } from "@/data/newsletter-posts";

export default function NewsletterPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-xl font-extrabold text-neutral-900 md:text-2xl">
        퍼스트 바이럴 뉴스레터
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        매주 인사이트를 전해드려요. 놓치지 마세요.
      </p>

      <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {newsletterPosts.map((post) => {
          const internal = post.url.startsWith("/");
          const Card = (
            <>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <h2 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">
                {post.title}
              </h2>
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
    </section>
  );
}
