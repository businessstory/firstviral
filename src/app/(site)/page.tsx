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
  return <span className={`block whitespace-nowrap ${className}`}>{children}</span>;
}

const CTA_CLASS =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap w-full max-w-md rounded-full bg-accent-gold px-5 py-4 text-[min(4.4vw,17px)] font-bold text-brand-950 shadow-[0_10px_30px_rgba(232,196,104,0.25),0_2px_6px_rgba(11,43,33,0.4)] transition-transform hover:scale-[1.03] hover:bg-[#f0d07c] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 active:scale-95 md:w-auto md:max-w-none md:px-10 md:text-lg";

export default function Home() {
  return (
    <>
      {/* 1. 공감 */}
      <section className="relative flex items-center overflow-hidden bg-brand-950 px-5 py-28 md:py-40 lg:min-h-[calc(100vh-4rem)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 15%, #1c4f3a 0%, #123b2c 40%, #0b2b21 75%), radial-gradient(circle at 85% 85%, rgba(232,196,104,0.12), transparent 40%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <p className="text-[min(4.6vw,22px)] font-medium text-brand-200 lg:text-[28px]">
            <Line>인스타, 진짜 열심히 만드는데</Line>
          </p>
          <h1 className="mt-5 text-[min(7.4vw,60px)] font-extrabold lg:mt-8 lg:text-[76px] leading-[1.3] tracking-tight text-white">
            <Line>돈이 안 돼서</Line>
            <Line className="text-accent-gold">&ldquo;진짜 이게 맞나?&rdquo;</Line>
            <Line>현타 온 적 있지 않으신가요?</Line>
          </h1>

          <svg
            className="mx-auto mt-16 animate-bounce text-brand-400"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* 2. 후기 영상 */}
      <section className="bg-brand-50 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center lg:grid lg:max-w-6xl lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16 lg:text-left">
          <div>
            <h2 className="text-[min(6.8vw,44px)] font-extrabold leading-[1.35] tracking-tight text-brand-950 lg:text-[52px]">
              <Line>이분들도</Line>
              <Line>
                처음 올 때 <span className="text-brand-600">그랬습니다!</span>
              </Line>
            </h2>
            <p className="mt-5 hidden text-lg leading-relaxed text-neutral-600 lg:block">
              <Line>열심히 올려도 반응이 없던 계정들,</Line>
              <Line>지금은 어떻게 달라졌는지 직접 들어보세요.</Line>
            </p>
            <Link
              href="/39"
              className="mt-8 hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-brand-700 px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 active:scale-95 lg:inline-flex"
            >
              수강생 후기 더 보기
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="mt-12 lg:mt-0 overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(11,43,33,0.18),0_4px_12px_rgba(11,43,33,0.08)] ring-1 ring-brand-100">
            <YouTubeEmbed youtubeId="FQKgCmWbMz0" title="수강생 후기 인터뷰" />
          </div>

          <Link
            href="/39"
            className="mt-8 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-brand-700 px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 active:scale-95 lg:hidden"
          >
            수강생 후기 더 보기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 3. 비포 & 애프터 */}
      <section className="bg-[#08100d] px-5 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center lg:max-w-6xl">
          <p className="text-[min(8vw,52px)] font-black lg:text-[64px] tracking-[0.04em] text-white">
            <Line>BEFORE &amp; AFTER</Line>
          </p>
          <h2 className="mt-4 text-[min(5.2vw,30px)] font-bold lg:text-[34px] leading-[1.45] text-white/80">
            <Line>조회수 수백 회에서</Line>
            <Line>
              <span className="text-accent-gold">수십만 회</span>로 바뀌었습니다
            </Line>
          </h2>

          <div className="mt-14 grid gap-10 md:gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
            {beforeAfter.map((item, i) => (
              <figure key={item.image}>
                <figcaption className="mb-4 flex items-center justify-center gap-3 whitespace-nowrap text-[min(4.4vw,22px)] font-bold">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-white/60 ring-1 ring-inset ring-white/15">
                    조회수 {item.before}
                  </span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" aria-hidden>
                    <path d="M4 12h14M13 6l6 6-6 6" />
                  </svg>
                  <span className="rounded-full bg-accent-gold/15 px-3 py-1 text-accent-gold ring-1 ring-inset ring-accent-gold/40">
                    조회수 {item.after}
                  </span>
                </figcaption>
                <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                  <Image
                    src={item.image}
                    alt={`비포 애프터 사례 ${i + 1}: 조회수 ${item.before}회에서 ${item.after}회`}
                    width={960}
                    height={665}
                    sizes="(min-width: 1024px) 560px, (min-width: 768px) 768px, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 무료특강 신청 */}
      <section className="relative overflow-hidden bg-brand-950 px-5 py-28 md:py-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 100%, rgba(232,196,104,0.18), transparent 50%), radial-gradient(circle at 50% 0%, #1c4f3a, #0b2b21 70%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-[min(7vw,52px)] font-extrabold lg:text-[64px] leading-[1.35] tracking-tight text-white">
            <Line>다음 차례는</Line>
            <Line>
              <span className="text-accent-gold">당신의 계정</span>입니다
            </Line>
          </h2>
          <p className="mt-6 text-[min(4.2vw,20px)] leading-relaxed text-brand-100/80 lg:text-[22px]">
            <Line>100만 뷰를 만든 방법,</Line>
            <Line>무료특강에서 전부 알려드릴게요</Line>
          </p>

          <p className="mt-12 text-[min(3.8vw,15px)] font-semibold text-brand-200">
            <Line>인스타그램 월 1000 연구소 오픈채팅방으로 연결돼요</Line>
          </p>
          <a href={LECTURE_URL} target="_blank" rel="noreferrer" className={`mt-4 ${CTA_CLASS}`}>
            비토리 100만 뷰 무료특강 신청하기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
