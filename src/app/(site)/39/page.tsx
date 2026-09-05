import VimeoEmbed from "@/components/VimeoEmbed";
import Tag from "@/components/Tag";

// TODO: 실제 Vimeo 후기 영상 ID로 교체하세요.
const featured = {
  vimeoId: "76979871",
  overline: "인스타그램 컨설팅 고객",
  title: "팔로워 3천에서 월 매출 300만원까지",
  poster: "https://placehold.co/800x450/0b2b21/ffffff?text=First+Viral",
};

const related = [
  {
    vimeoId: "76979871",
    impact: "첫 문의\n2주 만에",
    title: "쓰레드 시작 2주 만에 첫 문의가 들어왔어요",
    tag: "쓰레드",
    bg: "bg-gradient-to-br from-brand-700 to-brand-950",
  },
  {
    vimeoId: "76979871",
    impact: "팔로워는\n있었는데",
    title: "팔로워는 있었는데 왜 수익이 안 됐는지 알게 됐어요",
    tag: "컨설팅",
    bg: "bg-brand-950",
  },
  {
    vimeoId: "76979871",
    impact: "방향을\n완전히 바꿨어요",
    title: "1:1 컨설팅 받고 계정 방향을 완전히 바꿨어요",
    tag: "컨설팅",
    bg: "bg-gradient-to-br from-brand-600 to-brand-900",
  },
  {
    vimeoId: "76979871",
    impact: "부업으로\n월 200",
    title: "부업으로 시작해서 월 200 만드는 법",
    tag: "수익화",
    bg: "bg-gradient-to-br from-brand-400 to-brand-700",
  },
];

export default function ReviewsPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-xl font-extrabold text-neutral-900 md:text-2xl">수강생 후기</h1>
      <p className="mt-2 text-sm text-neutral-500">달라진 이야기를 직접 들어보세요</p>

      <div className="mt-8">
        <VimeoEmbed
          vimeoId={featured.vimeoId}
          title={featured.title}
          overline={featured.overline}
          poster={featured.poster}
        />
      </div>

      <div className="mt-10 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((video, i) => (
          <a key={i} href="#" className="group block">
            <div
              className={`relative aspect-video overflow-hidden rounded-2xl transition-transform group-hover:-translate-y-1 ${video.bg}`}
            >
              <span className="absolute inset-x-4 top-4 whitespace-pre-line text-xl font-black leading-[1.2] text-white">
                {video.impact}
              </span>
              <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <h2 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-neutral-900">
              {video.title}
            </h2>
            <div className="mt-2">
              <Tag>{video.tag}</Tag>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
