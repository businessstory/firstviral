import Link from "next/link";
import Tag from "@/components/Tag";
import PageTitle from "@/components/PageTitle";

const BUTTON_CLASS =
  "press mt-4 block w-full rounded-full py-3 text-center text-[15px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
const BUTTON_PRIMARY = `${BUTTON_CLASS} bg-brand-700 text-white hover:bg-brand-800`;
const BUTTON_SOON = `${BUTTON_CLASS} bg-brand-50 text-ink-muted cursor-not-allowed`;

type ClassItem = {
  image: string;
  title: string;
  tag: string;
  priceLabel: string;
  originalPriceLabel?: string;
  cta: { type: "link"; url: string } | { type: "page"; href: string } | { type: "soon" };
};

const classes: ClassItem[] = [
  {
    image: "/class/pdf3-consulting.webp",
    title: "[780명 구매 완료] 인스타 PDF 3종 + 1:1 맞춤 컨설팅",
    tag: "PDF 3종 + 컨설팅",
    priceLabel: "30,000원",
    originalPriceLabel: "69,000원",
    cta: { type: "page", href: "/consulting" },
  },
  {
    image: "/class/million-views-lecture.png",
    title: "AI로 월 100만 원 무료강의",
    tag: "무료 특강",
    priceLabel: "무료",
    cta: { type: "link", url: "https://open.kakao.com/o/gTR2UfQi" },
  },
];

export default function ClassPage() {
  return (
    <>
      <PageTitle eyebrow="선착순 15명 한정" title="클래스 & 컨설팅" desc="지금 가장 빠르게 성장하는 방법." />
      <section className="bg-brand-50">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <div key={cls.title} className="flex flex-col rounded-[18px] bg-white p-4 md:p-5">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-brand-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cls.image} alt={cls.title} className="h-full w-full object-cover" />
              </div>
              <div className="mt-3">
                <Tag>{cls.tag}</Tag>
              </div>
              <h3 className="mt-2 line-clamp-2 text-balance text-[17px] font-semibold leading-snug text-brand-950">{cls.title}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                {cls.originalPriceLabel && <span className="text-[14px] text-ink-muted line-through">{cls.originalPriceLabel}</span>}
                <p className="text-[19px] font-semibold text-brand-950">{cls.priceLabel}</p>
                {cls.originalPriceLabel && <Tag tone="new">할인중</Tag>}
              </div>
              <div className="mt-auto">
                {cls.cta.type === "link" && (
                  <a href={cls.cta.url} target="_blank" rel="noreferrer" className={BUTTON_PRIMARY}>
                    신청하기
                  </a>
                )}
                {cls.cta.type === "page" && (
                  <Link href={cls.cta.href} className={BUTTON_PRIMARY}>
                    신청하기
                  </Link>
                )}
                {cls.cta.type === "soon" && (
                  <button type="button" disabled className={BUTTON_SOON}>
                    준비 중
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
