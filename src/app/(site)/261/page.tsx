import Link from "next/link";
import LeadMagnetCard from "@/components/LeadMagnetCard";
import Tag from "@/components/Tag";

type FreeCard = {
  image: string;
  title: string;
  tag: string;
  isNew?: boolean;
  action: { type: "modal"; leadMagnet: string } | { type: "link"; href: string };
};

const cards: FreeCard[] = [
  {
    image: "/free-resources/million-views-pdf.png",
    title: "인스타그램 100만 뷰 공식 3가지 PDF",
    tag: "PDF",
    isNew: true,
    action: { type: "link", href: "/261/million-views" },
  },
  {
    image: "/free-resources/selfcheck.png",
    title: "인스타그램 자가진단 템플릿",
    tag: "체크리스트",
    action: { type: "modal", leadMagnet: "free_pdf_selfcheck" },
  },
  {
    image: "/free-resources/course-vod.png",
    title: "인스타그램 수익화 무료 강의",
    tag: "무료 강의",
    action: { type: "modal", leadMagnet: "free_course" },
  },
];

function CardVisual({ card }: { card: FreeCard }) {
  return (
    <>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100 transition-transform group-hover:-translate-y-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
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
