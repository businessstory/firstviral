import Link from "next/link";
import LeadMagnetCard from "@/components/LeadMagnetCard";
import Tag from "@/components/Tag";

type FreeCard = {
  impact: string;
  title: string;
  tag: string;
  isNew?: boolean;
  bg: string;
  action: { type: "modal"; leadMagnet: string } | { type: "link"; href: string };
};

const cards: FreeCard[] = [
  {
    impact: "내 계정\n진짜 문제는?",
    title: "인스타그램 자가진단 템플릿",
    tag: "체크리스트",
    bg: "bg-gradient-to-br from-brand-600 to-brand-900",
    action: { type: "modal", leadMagnet: "free_pdf_selfcheck" },
  },
  {
    impact: "팔로워를\n돈으로",
    title: "인스타그램 수익화 무료 강의",
    tag: "무료 강의",
    isNew: true,
    bg: "bg-brand-950",
    action: { type: "modal", leadMagnet: "free_course" },
  },
  {
    impact: "100만 뷰\n공식 3가지",
    title: "인스타그램 100만 뷰 공식 3가지 PDF",
    tag: "PDF",
    bg: "bg-gradient-to-br from-brand-400 to-brand-700",
    action: { type: "link", href: "/261/million-views" },
  },
];

function CardVisual({ card }: { card: FreeCard }) {
  return (
    <>
      <div
        className={`relative aspect-video overflow-hidden rounded-2xl transition-transform group-hover:-translate-y-1 ${card.bg}`}
      >
        <span className="absolute inset-x-4 top-4 whitespace-pre-line text-xl font-black leading-[1.2] text-white">
          {card.impact}
        </span>
      </div>
      <h2 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-neutral-900">{card.title}</h2>
      <div className="mt-2 flex items-center gap-1.5">
        <Tag>{card.tag}</Tag>
        <Tag tone="gold">무료</Tag>
        {card.isNew && <Tag tone="new">New</Tag>}
      </div>
    </>
  );
}

export default function FreePdfPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-xl font-extrabold text-neutral-900 md:text-2xl">무료 자료실</h1>
      <p className="mt-2 text-sm text-neutral-500">
        팔로워는 있는데 수익이 안 된다면, 지금 무료로 확인해보세요
      </p>

      <div className="mt-10 grid gap-x-5 gap-y-9 sm:grid-cols-3">
        {cards.map((card) =>
          card.action.type === "modal" ? (
            <LeadMagnetCard
              key={card.title}
              leadMagnet={card.action.leadMagnet}
              title={card.title}
              className="group"
            >
              <CardVisual card={card} />
            </LeadMagnetCard>
          ) : (
            <Link key={card.title} href={card.action.href} className="group block">
              <CardVisual card={card} />
            </Link>
          )
        )}
      </div>
    </section>
  );
}
