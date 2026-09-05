import Tag from "@/components/Tag";

const KAKAO_URL = "https://open.kakao.com/o/sGuTwRLi";

const BUTTON_CLASS =
  "mt-4 block w-full rounded-full py-3 text-center text-sm font-semibold transition-transform active:scale-95 focus:outline-none focus:ring-2";
const BUTTON_PRIMARY = `${BUTTON_CLASS} bg-brand-700 text-white hover:scale-[1.02] hover:bg-brand-800 focus:ring-brand-700`;
const BUTTON_SOON = `${BUTTON_CLASS} bg-neutral-100 text-neutral-400 cursor-not-allowed`;

type ClassItem = {
  image: string;
  title: string;
  tag: string;
  priceLabel: string;
  originalPriceLabel?: string;
  cta: { type: "link"; url: string } | { type: "kakao" } | { type: "soon" };
};

const classes: ClassItem[] = [
  {
    image: "/class/consulting.png",
    title: "1:1 맞춤 인스타그램 컨설팅(오프라인)",
    tag: "1:1 컨설팅",
    priceLabel: "30,000원",
    originalPriceLabel: "200,000원",
    cta: { type: "link", url: "https://litt.ly/businessstory/sale/p73JCxQ" },
  },
  {
    image: "/class/reels-agency.png",
    title: "프리미엄 릴스 대행",
    tag: "대행",
    priceLabel: "가격 문의",
    cta: { type: "kakao" },
  },
  {
    image: "/class/million-views-lecture.png",
    title: "100만 뷰 콘텐츠 무료 특강",
    tag: "무료 특강",
    priceLabel: "무료",
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
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100 transition-transform group-hover:-translate-y-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cls.image} alt={cls.title} className="h-full w-full object-cover" />
            </div>

            <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-neutral-900">
              {cls.title}
            </h3>
            <div className="mt-2">
              <Tag>{cls.tag}</Tag>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {cls.originalPriceLabel && (
                <span className="text-sm text-neutral-400 line-through">{cls.originalPriceLabel}</span>
              )}
              <p className="text-lg font-extrabold text-neutral-900">{cls.priceLabel}</p>
              {cls.originalPriceLabel && <Tag tone="new">할인중</Tag>}
            </div>

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
