import { getInstagramPreview } from "@/lib/instagramPreview";
import InstagramCardImage from "./InstagramCardImage";

function InstagramGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 인스타그램 공식 임베드 위젯 대신, 공개 메타 태그(og:image 등)만 가져와서
// 직접 카드로 그려주는 가벼운 미리보기. 위젯이 게시물 단위로 막혀도 안정적으로 동작함.
export default async function InstagramCard({ url }: { url: string }) {
  const preview = await getInstagramPreview(url);

  if (!preview) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="my-4 block rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
      >
        인스타그램에서 게시물 보기
      </a>
    );
  }

  return (
    <a
      href={preview.permalink}
      target="_blank"
      rel="noreferrer"
      className="group my-4 block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-0.5"
    >
      {preview.imageUrl && (
        <div className="aspect-square w-full max-w-[360px] bg-neutral-100">
          <InstagramCardImage src={preview.imageUrl} alt={preview.title} />
        </div>
      )}
      <div className="flex items-center gap-1.5 px-4 py-3">
        <InstagramGlyph />
        <p className="truncate text-sm font-medium text-neutral-700 group-hover:text-brand-700">
          {preview.title}
        </p>
      </div>
    </a>
  );
}
