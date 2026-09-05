import YouTubeEmbed from "@/components/YouTubeEmbed";
import ReviewsList from "@/components/ReviewsList";

// 실제 편집 완료된 후기 영상
const featured = {
  youtubeId: "FQKgCmWbMz0",
  overline: "수강생 후기",
  title: "퍼스트 바이럴과 함께한 이야기",
};

// TODO: 영상 편집이 끝나는 대로 이름 옆에 유튜브 ID를 추가해서 실제 영상으로 교체하세요.
const studentNames = [
  "박태준 대표님",
  "기정혁님",
  "염인선 대표님",
  "김태린님",
  "김은경 대표님",
  "김예린님",
  "박미경님",
  "한송이님",
  "박금동 대표님",
  "강현민 대표님",
];

export default function ReviewsPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-xl font-extrabold text-neutral-900 md:text-2xl">수강생 후기</h1>
      <p className="mt-2 text-sm text-neutral-500">달라진 이야기를 직접 들어보세요</p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-brand-950">수강생 후기</h2>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <YouTubeEmbed
            youtubeId={featured.youtubeId}
            title={featured.title}
            overline={featured.overline}
          />
          <ReviewsList names={studentNames} />
        </div>
      </div>
    </section>
  );
}
