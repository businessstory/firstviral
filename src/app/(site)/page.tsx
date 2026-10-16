import Image from "next/image";
import Link from "next/link";
import YouTubeEmbed from "@/components/YouTubeEmbed";

// 인스타그램 월 1000 연구소 오픈채팅방
const LECTURE_URL = "https://open.kakao.com/o/guYU4YMi";

// 수강생 계정의 실제 조회수 변화 (public/home/before-after-*.webp)
const beforeAfter = [
  { image: "/home/before-after-1.webp", before: "289", after: "289.8만" },
  { image: "/home/before-after-2.webp", before: "263", after: "105.9만" },
  { image: "/home/before-after-3.webp", before: "243", after: "111.3만" },
  { image: "/home/before-after-4.webp", before: "1,863", after: "36.2만" },
];

// 모바일에서 어중간하게 줄바꿈되지 않도록, 줄마다 끊고 화면 폭에 맞춰 글자 크기를 줄인다.
function Line({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`line ${className}`}>{children}</span>;
}

const PILL =
  "press inline-flex items-center justify-center whitespace-nowrap rounded-full px-[22px] py-[11px] text-[min(4.2vw,17px)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
const PILL_PRIMARY = `${PILL} bg-brand-700 text-white hover:bg-brand-800`;
const PILL_GHOST = `${PILL} border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white`;

export default function Home() {
  return (
    <>
      {/* 1. 공감 (light) */}
      <section className="bg-white px-5 pb-20 pt-20 text-center md:pb-28 md:pt-28">
        <p className="text-[min(5vw,24px)] font-semibold text-brand-950">
          <Line>인스타, 진짜 열심히 만드는데</Line>
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-[min(8.4vw,64px)] font-semibold leading-[1.1] text-brand-950">
          <Line>돈이 안 돼서</Line>
          <Line className="text-brand-700">&ldquo;진짜 이게 맞나?&rdquo;</Line>
          <Line>현타 온 적 있으신가요?</Line>
        </h1>
        <div className="mt-9 flex justify-center gap-3">
          <a href={LECTURE_URL} target="_blank" rel="noreferrer" className={PILL_PRIMARY}>
            무료특강 신청하기
          </a>
          <Link href="/39" className={PILL_GHOST}>
            수강생 후기 보기
          </Link>
        </div>
      </section>

      {/* 2. 후기 영상 (dark tile) */}
      <section className="bg-brand-900 px-5 py-20 text-center text-white md:py-28">
        <h2 className="text-[min(8vw,48px)] font-semibold leading-[1.1]">
          <Line>이분들도</Line>
          <Line>처음 올 때 그랬습니다.</Line>
        </h2>
        <p className="mt-4 text-[min(4.4vw,21px)] text-brand-200">
          <Line>열심히 올려도 반응이 없던 계정들,</Line>
          <Line>지금은 어떻게 달라졌는지 들어보세요.</Line>
        </p>
        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[18px] shadow-product">
          <YouTubeEmbed youtubeId="FQKgCmWbMz0" title="수강생 후기 인터뷰" />
        </div>
        <Link href="/39" className="mt-8 inline-flex items-center gap-1 whitespace-nowrap text-[min(4.4vw,19px)] text-brand-400 hover:underline focus:outline-none focus-visible:underline">
          수강생 후기 더 보기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>
      </section>

      {/* 3. 비포 & 애프터 (parchment) */}
      <section className="bg-brand-50 px-5 py-20 text-center md:py-28">
        <p className="text-[min(4vw,17px)] font-semibold text-brand-700">
          <Line>BEFORE &amp; AFTER</Line>
        </p>
        <h2 className="mt-2 text-[min(7.6vw,48px)] font-semibold leading-[1.1] text-brand-950">
          <Line>조회수 수백 회에서</Line>
          <Line>수십만 회로.</Line>
        </h2>
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-2">
          {beforeAfter.map((item, i) => (
            <figure key={item.image} className="overflow-hidden rounded-[18px] bg-white p-4 text-left md:p-6">
              <figcaption className="mb-4 flex items-center justify-between gap-3 whitespace-nowrap">
                <span className="text-[min(4vw,17px)] font-semibold text-brand-950">사례 {i + 1}</span>
                <span className="flex items-center gap-2 text-[min(3.8vw,17px)]">
                  <span className="text-ink-muted">조회수 {item.before}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a7a7a" strokeWidth="2.4" aria-hidden>
                    <path d="M4 12h14M13 6l6 6-6 6" />
                  </svg>
                  <span className="font-semibold text-brand-700">조회수 {item.after}</span>
                </span>
              </figcaption>
              <Image
                src={item.image}
                alt={`비포 애프터 사례 ${i + 1}: 조회수 ${item.before}회에서 ${item.after}회`}
                width={960}
                height={665}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full rounded-lg"
              />
            </figure>
          ))}
        </div>
      </section>

      {/* 4. 무료특강 신청 (dark tile) */}
      <section className="bg-black px-5 py-24 text-center text-white md:py-32">
        <h2 className="text-[min(8.4vw,56px)] font-semibold leading-[1.1]">
          <Line>다음 차례는</Line>
          <Line>당신의 계정입니다.</Line>
        </h2>
        <p className="mt-5 text-[min(4.4vw,21px)] text-brand-200">
          <Line>100만 뷰를 만든 방법,</Line>
          <Line>무료특강에서 전부 알려드릴게요.</Line>
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <a href={LECTURE_URL} target="_blank" rel="noreferrer" className={PILL_PRIMARY}>
            비토리 100만 뷰 무료특강 신청하기
          </a>
          <Link href="/consulting" className="inline-flex items-center gap-1 whitespace-nowrap text-[min(4.2vw,17px)] text-brand-400 hover:underline">
            PDF 3종 + 1:1 컨설팅 알아보기
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        <p className="mt-8 text-[min(3.4vw,13px)] text-ink-muted">
          <Line>인스타그램 월 1000 연구소 오픈채팅방으로 연결돼요</Line>
        </p>
      </section>
    </>
  );
}
