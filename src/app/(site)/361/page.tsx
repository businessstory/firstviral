const KAKAO_URL = "https://open.kakao.com/o/sGuTwRLi";

const BUTTON_CLASS =
  "mt-4 block w-full rounded-full py-3 text-center text-sm font-semibold transition-transform active:scale-95 focus:outline-none focus:ring-2";
const BUTTON_PRIMARY = `${BUTTON_CLASS} bg-brand-700 text-white hover:scale-[1.02] hover:bg-brand-800 focus:ring-brand-700`;
const BUTTON_SOON = `${BUTTON_CLASS} bg-neutral-100 text-neutral-400 cursor-not-allowed`;

type ClassItem = {
  title: string;
  desc: string;
  priceLabel: string;
  thumbBg: string;
  cta: { type: "link"; url: string } | { type: "kakao" } | { type: "soon" };
};

const classes: ClassItem[] = [
  {
    title: "1:1 맞춤 인스타그램 컨설팅",
    desc: "팔로워는 있는데 수익으로 안 이어진다면, 계정을 함께 진단하고 수익화 방향을 잡아드려요.",
    priceLabel: "30,000원",
    thumbBg: "bg-brand-950",
    cta: { type: "link", url: "https://litt.ly/businessstory/sale/p73JCxQ" },
  },
  {
    title: "메타광고 교육",
    desc: "인스타그램·페이스북 광고를 처음부터 직접 세팅하고 운영하는 법을 알려드려요.",
    priceLabel: "90,000원",
    thumbBg: "bg-gradient-to-br from-brand-500 to-brand-800",
    cta: { type: "kakao" },
  },
  {
    title: "인스타 교육",
    desc: "계정 세팅부터 콘텐츠 전략까지, 인스타그램 성장의 기본기를 잡아드려요.",
    priceLabel: "가격 문의",
    thumbBg: "bg-gradient-to-br from-brand-400 to-brand-700",
    cta: { type: "kakao" },
  },
  {
    title: "릴스 대행",
    desc: "기획부터 제작까지, 릴스 콘텐츠를 대신 만들어드려요.",
    priceLabel: "가격 문의",
    thumbBg: "bg-gradient-to-br from-brand-700 to-brand-950",
    cta: { type: "kakao" },
  },
  {
    title: "메타광고 대행",
    desc: "광고 세팅부터 운영, 최적화까지 전체를 대신 관리해드려요.",
    priceLabel: "가격 문의",
    thumbBg: "bg-gradient-to-br from-brand-800 to-brand-950",
    cta: { type: "kakao" },
  },
];

export default function ClassPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
          선착순 15명 한정
        </span>

        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900 md:text-3xl">
          클래스 &amp; 컨설팅
        </h1>
        <p className="mt-3 text-sm text-neutral-500">
          팔로워는 있는데 수익이 안 된다면, 지금 1:1로 진단받아보세요
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div key={cls.title} className="flex flex-col">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${cls.thumbBg}`}>
              <span className="absolute inset-x-5 bottom-5 text-xl font-extrabold text-white/90">
                {cls.title}
              </span>
            </div>

            <h3 className="mt-4 text-base font-bold leading-snug text-neutral-900">
              {cls.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">{cls.desc}</p>
            <p className="mt-3 text-lg font-extrabold text-neutral-900">{cls.priceLabel}</p>

            {cls.cta.type === "link" && (
              <a href={cls.cta.url} target="_blank" rel="noreferrer" className={BUTTON_PRIMARY}>
                신청하기
              </a>
            )}
            {cls.cta.type === "kakao" && (
              <a href={KAKAO_URL} target="_blank" rel="noreferrer" className={BUTTON_PRIMARY}>
                카카오톡으로 문의하기
              </a>
            )}
            {cls.cta.type === "soon" && (
              <button type="button" disabled className={BUTTON_SOON}>
                준비 중
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
