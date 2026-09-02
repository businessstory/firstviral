import LeadMagnetCard from "@/components/LeadMagnetCard";

const cards = [
  {
    leadMagnet: "free_pdf_selfcheck",
    badge: "가장 많이 본 무료 자료",
    title: "인스타그램 자가진단 템플릿",
    bg: "bg-[#F23C7F]",
  },
  {
    leadMagnet: "free_course",
    badge: "팔로워를 수익으로 바꾸는 법",
    title: "인스타그램 수익화 무료 강의",
    bg: "bg-[#1A2140]",
  },
  {
    leadMagnet: "threads_pdf",
    badge: "쓰레드로 첫 문의 받은 방법",
    title: "쓰레드 성장 무료 PDF",
    bg: "bg-[#E8395A]",
  },
];

export default function FreePdfPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20 text-center">
      <p className="text-sm font-bold text-neutral-400">퍼스트 바이럴</p>

      <h1 className="mt-4 text-2xl font-extrabold leading-snug text-neutral-900 md:text-4xl">
        팔로워를 수익으로 바꾸는
        <br />
        가장 빠른 방법
      </h1>

      <p className="mt-5 text-xs text-neutral-400">
        *인스타그램, 쓰레드 둘 다 활용 가능합니다
      </p>
      <p className="mt-1 text-sm text-neutral-500">
        팔로워는 있는데 수익이 안 된다면, 지금 무료로 확인해보세요
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <LeadMagnetCard
            key={card.title}
            leadMagnet={card.leadMagnet}
            title={card.title}
            className={`group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-2xl p-5 text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white active:translate-y-0 ${card.bg}`}
          >
            <span className="text-xs font-semibold leading-snug text-white/85">
              {card.badge}
            </span>

            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-transform group-hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>

            <span className="text-lg font-bold leading-snug">{card.title}</span>
          </LeadMagnetCard>
        ))}
      </div>
    </section>
  );
}
