import LeadMagnetCard from "@/components/LeadMagnetCard";

const templates = [
  {
    leadMagnet: "template_selfcheck",
    label: "Self-Check Template",
    title: "인스타그램 자가진단 템플릿",
    desc: "내 계정이 왜 수익으로 안 이어지는지, 직접 체크해볼 수 있는 자가진단 템플릿이에요.",
    bg: "bg-brand-950",
    text: "text-white",
    labelBg: "bg-accent-gold text-brand-950",
  },
  {
    leadMagnet: "template_vod",
    label: "Monetization VOD",
    title: "인스타그램 수익화 강의 VOD",
    desc: "팔로워를 수익으로 연결하는 방법을 처음부터 끝까지 담은 영상 강의예요.",
    bg: "bg-gradient-to-br from-brand-500 to-brand-800",
    text: "text-white",
    labelBg: "bg-white text-brand-800",
  },
];

export default function TemplatesPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-center text-2xl font-extrabold leading-snug text-neutral-900 md:text-3xl">
        인스타그램 수익화를 위한 전용 자료
      </h1>
      <p className="mt-3 text-center text-sm text-neutral-500">
        이름과 연락처를 남기면 바로 보내드려요
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {templates.map((tpl) => (
          <LeadMagnetCard key={tpl.title} leadMagnet={tpl.leadMagnet} title={tpl.title} className="group">
            <div
              className={`relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-transform group-hover:-translate-y-1 ${tpl.bg} ${tpl.text}`}
            >
              {/* TODO: 브랜드 로고로 교체 */}
              <span className="text-xs font-bold tracking-wide">퍼스트 바이럴</span>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${tpl.labelBg}`}
              >
                {tpl.label}
              </span>
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-neutral-800">
              {tpl.title}
            </p>
            <p className="mt-1 text-center text-xs leading-relaxed text-neutral-500">
              {tpl.desc}
            </p>
          </LeadMagnetCard>
        ))}
      </div>
    </section>
  );
}
