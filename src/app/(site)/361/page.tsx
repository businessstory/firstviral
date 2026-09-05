import Tag from "@/components/Tag";

const KAKAO_URL = "https://open.kakao.com/o/sGuTwRLi";

const BUTTON_CLASS =
  "mt-4 block w-full rounded-full py-3 text-center text-sm font-semibold transition-transform active:scale-95 focus:outline-none focus:ring-2";
const BUTTON_PRIMARY = `${BUTTON_CLASS} bg-brand-700 text-white hover:scale-[1.02] hover:bg-brand-800 focus:ring-brand-700`;
const BUTTON_SOON = `${BUTTON_CLASS} bg-neutral-100 text-neutral-400 cursor-not-allowed`;

type ClassItem = {
  impact: string;
  title: string;
  tag: string;
  priceLabel: string;
  thumbBg: string;
  cta: { type: "link"; url: string } | { type: "kakao" } | { type: "soon" };
};

const classes: ClassItem[] = [
  {
    impact: "계정 문제\n1:1 진단",
    title: "1:1 맞춤 인스타그램 컨설팅",
    tag: "1:1 컨설팅",
    priceLabel: "30,000원",
    thumbBg: "bg-brand-950",
    cta: { type: "link", url: "https://litt.ly/businessstory/sale/p73JCxQ" },
  },
  {
    impact: "릴스\n대신 만들어드려요",
    title: "프리미엄 릴스 대행",
    tag: "대행",
    priceLabel: "가격 문의",
    thumbBg: "bg-gradient-to-br from-brand-700 to-brand-950",
    cta: { type: "kakao" },
  },
  {
    impact: "100만 뷰\n공식 공개",
    title: "100만 뷰 콘텐츠 무료 특강",
    tag: "무료 특강",
    priceLabel: "무료",
    thumbBg: "bg-gradient-to-br from-brand-400 to-brand-700",
    cta: { type: "link", url: "https://open.kakao.com/o/gyj1vFIi" },
  },
];

export default function ClassPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
          선착순 15명 한정
        </span>
      </div>
      <h1 className="mt-3 text-xl font-extrabold text-neutral-900 md:text-2xl">클래스 &amp; 컨설팅</h1>

      <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div key={cls.title} className="group flex flex-col">
            <div
              className={`relative aspect-square overflow-hidden rounded-2xl transition-transform group-hover:-translate-y-1 ${cls.thumbBg}`}
            >
              <span className="absolute inset-x-4 bottom-4 whitespace-pre-line text-2xl font-black leading-[1.15] text-white">
                {cls.impact}
              </span>
            </div>

            <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-neutral-900">
              {cls.title}
            </h3>
            <div className="mt-2">
              <Tag>{cls.tag}</Tag>
            </div>
            <p className="mt-2 text-lg font-extrabold text-neutral-900">{cls.priceLabel}</p>

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
