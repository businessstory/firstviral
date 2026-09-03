import VimeoEmbed from "@/components/VimeoEmbed";

// TODO: 실제 Vimeo 후기 영상 ID로 교체하세요.
const featured = {
  vimeoId: "76979871",
  overline: "인스타그램 컨설팅 고객",
  title: "팔로워 3천에서 월 매출 300만원까지",
  poster: "https://placehold.co/800x450/0b2b21/ffffff?text=First+Viral",
};

const related = [
  { vimeoId: "76979871", title: "쓰레드 시작 2주 만에 첫 문의가 들어왔어요" },
  { vimeoId: "76979871", title: "팔로워는 있었는데 왜 수익이 안 됐는지 알게 됐어요" },
  { vimeoId: "76979871", title: "1:1 컨설팅 받고 계정 방향을 완전히 바꿨어요" },
  { vimeoId: "76979871", title: "부업으로 시작해서 월 200 만드는 법" },
];

export default function ReviewsPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold leading-snug text-neutral-900 md:text-3xl">
          퍼스트 바이럴 고객들의
          <br />
          <a href="#interviews" className="text-brand-700 underline underline-offset-4">
            인터뷰&후기를 확인해보세요
          </a>
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-neutral-500">
          팔로워는 있었지만 수익은 없었던 사람들이
          <br />
          컨설팅 이후 달라진 이야기
        </p>
      </div>

      <div id="interviews" className="mt-14">
        <h2 className="text-sm font-bold text-neutral-900">퍼스트 바이럴 고객 인터뷰</h2>

        <div className="mt-4 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <VimeoEmbed
            vimeoId={featured.vimeoId}
            title={featured.title}
            overline={featured.overline}
            poster={featured.poster}
          />

          <div className="flex flex-col gap-3">
            {related.map((video, i) => (
              <a
                key={i}
                href="#"
                className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-brand-800">
                  <span className="absolute inset-0 flex items-center justify-center text-brand-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
                <p className="line-clamp-2 text-sm font-medium leading-snug text-neutral-800 group-hover:text-neutral-950">
                  {video.title}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
