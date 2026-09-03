import Link from "next/link";
import VimeoEmbed from "@/components/VimeoEmbed";

// TODO: 아래 문구들은 레이아웃만 참고한 자리표시(placeholder) 카피입니다.
// 브랜드 실제 헤드라인/스토리/후기 콘텐츠로 교체해주세요.
const painPoints = [
  "팔로워는 꽤 있는데\n수익으로 이어지지가\n않아요.",
  "인스타그램은 하고 있는데\n쓰레드는 어떻게\n시작할지 모르겠어요.",
  "부업으로 SNS를 키우고는\n있는데 방향이 맞는지\n확신이 안 서요.",
  "혼자 이것저것 해봤지만\n뭐가 문제인지\n모르겠어요.",
];

export default function Home() {
  return (
    <>
      {/* 히어로 */}
      <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden bg-brand-950 py-28">
        {/* TODO: 자체 촬영 이미지/영상으로 교체 (현재는 임시 플레이스홀더) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, #1c4f3a 0%, #123b2c 45%, #0b2b21 80%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 85%, rgba(111,207,151,0.18), transparent 45%), radial-gradient(circle at 85% 15%, rgba(232,196,104,0.12), transparent 40%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-900/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-200">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            Instagram &amp; Threads Consulting
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-white md:text-6xl lg:text-7xl">
            트래픽을 수익으로 바꾸는
            <br />
            가장 빠른 방법
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-brand-100/80 md:text-base">
            계정마다 문제는 다 다릅니다. 1:1로 진단받고 방향을 잡아보세요.
          </p>

          <Link
            href="/261"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent-gold px-7 py-3.5 text-sm font-bold text-brand-950 shadow-[0_10px_30px_rgba(232,196,104,0.25)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-400 active:scale-95"
          >
            무료 자가진단 받아보기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 페인포인트 */}
      <section className="bg-brand-950 px-5 py-24">
        <h2 className="mx-auto max-w-xl text-center text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
          열심히 하고 있는데,
          <br />
          이런 고민 있지 않으세요?
        </h2>

        <div className="mx-auto mt-14 grid max-w-4xl gap-x-10 gap-y-12 sm:grid-cols-2">
          {painPoints.map((text, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-800 text-brand-400 ring-1 ring-inset ring-brand-700">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>
              </span>
              <p className="mt-5 whitespace-pre-line text-base font-semibold leading-relaxed text-white">
                {text}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-lg font-bold text-white">
          그렇다면, 잘 찾아오셨어요!
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/361"
            className="inline-flex items-center gap-2 rounded-full bg-accent-gold px-7 py-3.5 text-sm font-bold text-brand-950 shadow-[0_10px_30px_rgba(232,196,104,0.25)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-400 active:scale-95"
          >
            1:1 컨설팅 신청하기
          </Link>
        </div>
      </section>

      {/* 고객 후기 티저 */}
      <section className="bg-brand-50 px-5 py-24 text-center">
        <h2 className="text-2xl font-bold leading-snug text-brand-950 md:text-3xl">
          팔로워는 있었지만
          <br />
          수익은 없었던 사람들의 이야기
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
          각기 다른 계정, 다른 시작점.
          <br />
          하지만 한 가지 공통점은 &ldquo;퍼스트 바이럴에서 방향을 찾았다&rdquo;는 것입니다.
        </p>
        <Link
          href="/39"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-700 px-7 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95"
        >
          인터뷰 확인하기
        </Link>
      </section>

      {/* 브랜드 스토리 */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold leading-snug text-brand-950 md:text-3xl">
              효과가 있을지 확신이 안 선다면,
              <br />
              먼저 진단부터 받아보세요.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-neutral-600">
              계정마다 문제는 다 달라요.
              <br />
              똑같은 조언을 반복하는 대신, 1:1로 계정을 직접 보고 진단합니다.
              <br />
              <br />
              {/* TODO: 실제 브랜드 스토리/경력/성과로 교체 */}
              퍼스트 바이럴은 그 경험을 당신이 바로 실행할 수 있는 형태로 제공합니다.
            </p>
            <Link
              href="/361"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95"
            >
              1:1 컨설팅 신청하기
            </Link>
          </div>

          {/* TODO: 실제 브랜드 소개 영상 Vimeo ID로 교체 */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-brand-100">
            <VimeoEmbed vimeoId="76979871" title="브랜드 소개 영상" />
          </div>
        </div>
      </section>
    </>
  );
}
