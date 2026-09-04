import { notFound } from "next/navigation";
import { getCardNewsById } from "@/lib/supabase";
import LinkifiedText from "@/components/LinkifiedText";

export const revalidate = 300;

export default async function CardNewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getCardNewsById(id);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="mb-8 w-full rounded-2xl object-cover"
        />
      )}
      <p className="text-xs text-neutral-400">
        {new Date(post.published_at).toLocaleDateString("ko-KR")}
      </p>
      <h1 className="mt-2 text-2xl font-extrabold leading-snug text-neutral-900 md:text-3xl">
        {post.title}
      </h1>
      <div className="mt-8 text-sm text-neutral-700">
        <LinkifiedText text={post.body} />
      </div>
    </article>
  );
}
