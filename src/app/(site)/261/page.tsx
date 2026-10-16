import Link from "next/link";
import LeadMagnetCard from "@/components/LeadMagnetCard";
import DownloadWithPopup from "@/components/DownloadWithPopup";
import Tag from "@/components/Tag";
import PageTitle from "@/components/PageTitle";

type FreeCard = {
  image: string;
  title: string;
  tag: string;
  isNew?: boolean;
  action:
    | { type: "modal"; leadMagnet: string }
    | { type: "link"; href: string }
    | { type: "download"; href: string; filename: string };
};

const cards: FreeCard[] = [
  {
    image: "/free-resources/claude-topic-prompt.png",
    title: "카테고리만 넣으면 주제 10개 뽑아주는 클로드 프롬프트",
    tag: "프롬프트",
    isNew: true,
    action: { type: "download", href: "/free-resources/claude-topic-prompt.txt", filename: "클로드_인스타_주제추천_프롬프트.txt" },
  },
  {
    image: "/free-resources/carousel-prompt.png",
    title: "캐러셀 무료 프롬프트",
    tag: "프롬프트",
    isNew: true,
    action: { type: "download", href: "/free-resources/carousel-prompt.txt", filename: "인스타그램_캐러셀_무료_프롬프트.txt" },
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

// 애플 store-utility-card: 흰 카드 + 얇은 테두리 + 18px 모서리
function CardVisual({ card }: { card: FreeCard }) {
  return (
    <div className="flex h-full flex-col rounded-[18px] bg-white p-4 transition-transform group-hover:-translate-y-0.5 md:p-5">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-brand-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {card.isNew && <Tag tone="new">New</Tag>}
        <Tag>{card.tag}</Tag>
      </div>
      <h2 className="mt-2 line-clamp-2 text-balance text-[17px] font-semibold leading-snug text-brand-950">{card.title}</h2>
      <p className="mt-auto flex items-center gap-1 pt-3 text-[15px] text-brand-700">
        무료로 받기
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </p>
    </div>
  );
}

export default function FreePdfPage() {
  return (
    <>
      <PageTitle eyebrow="FREE" title="무료 자료실" desc="수익이 안 된다면, 지금 무료로 확인해 보세요." />
      <section className="bg-brand-50">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) =>
            card.action.type === "modal" ? (
              <LeadMagnetCard key={card.title} leadMagnet={card.action.leadMagnet} title={card.title} className="group h-full rounded-[18px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                <CardVisual card={card} />
              </LeadMagnetCard>
            ) : card.action.type === "download" ? (
              <DownloadWithPopup key={card.title} href={card.action.href} filename={card.action.filename}>
                <CardVisual card={card} />
              </DownloadWithPopup>
            ) : (
              <Link key={card.title} href={card.action.href} className="group block h-full rounded-[18px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                <CardVisual card={card} />
              </Link>
            )
          )}
        </div>
      </section>
    </>
  );
}
