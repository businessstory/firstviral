import LeadMagnetCard from "@/components/LeadMagnetCard";
import Tag from "@/components/Tag";

type FreeCard = {
  leadMagnet: string;
  impact: string;
  title: string;
  tag: string;
  isNew?: boolean;
  bg: string;
};

const cards: FreeCard[] = [
  {
    leadMagnet: "free_pdf_selfcheck",
    impact: "내 계정\n진짜 문제는?",
    title: "인스타그램 자가진단 템플릿",
    tag: "체크리스트",
    bg: "bg-gradient-to-br from-brand-600 to-brand-900",
  },
  {
    leadMagnet: "free_course",
    impact: "팔로워를\n돈으로",
    title: "인스타그램 수익화 무료 강의",
    tag: "무료 강의",
    isNew: true,
    bg: "bg-brand-950",
  },
  {
    leadMagnet: "threads_pdf",
    impact: "조회수 =\n매출",
    title: "조회수로 돈을 버는 방법 TOP 3",
    tag: "쓰레드",
    bg: "bg-gradient-to-br from-brand-400 to-brand-700",
  },
];

export default function FreePdfPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-xl font-extrabold text-neutral-900 md:text-2xl">무료 자료실</h1>
      <p className="mt-2 text-sm text-neutral-500">
        팔로워는 있는데 수익이 안 된다면, 지금 무료로 확인해보세요
      </p>

      <div className="mt-10 grid gap-x-5 gap-y-9 sm:grid-cols-3">
        {cards.map((card) => (
          <LeadMagnetCard key={card.title} leadMagnet={card.leadMagnet} title={card.title} className="group">
            <div
              className={`relative aspect-square overflow-hidden rounded-2xl transition-transform group-hover:-translate-y-1 ${card.bg}`}
            >
              <span className="absolute inset-x-4 bottom-4 whitespace-pre-line text-2xl font-black leading-[1.15] text-white">
                {card.impact}
              </span>
              <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <h2 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-neutral-900">
              {card.title}
            </h2>
            <div className="mt-2 flex items-center gap-1.5">
              <Tag>{card.tag}</Tag>
              <Tag tone="gold">무료</Tag>
              {card.isNew && <Tag tone="new">New</Tag>}
            </div>
          </LeadMagnetCard>
        ))}
      </div>
    </section>
  );
}
