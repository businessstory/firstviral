import ApplyButton from "@/components/ApplyButton";

const BUTTON_CLASS =
  "mt-4 block w-full rounded-full bg-neutral-900 py-3 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60";

const classes = [
  {
    title: "1:1 맞춤 인스타그램 컨설팅",
    desc: "팔로워는 있는데 수익으로 안 이어진다면, 계정을 함께 진단하고 수익화 방향을 잡아드려요.",
    price: 30000,
    priceLabel: "30,000원",
    thumbBg: "bg-[#242424]",
    // 결제 링크 확보됨
    link: "https://litt.ly/businessstory/sale/p73JCxQ",
  },
  {
    title: "1:1 맞춤 쓰레드 컨설팅",
    desc: "쓰레드 계정 구조부터 수익화 전략까지, 1:1로 맞춤 컨설팅해드려요.",
    price: 30000,
    priceLabel: "30,000원",
    thumbBg: "bg-[#2A2A2A]",
    // TODO: 결제 링크 확보되면 채우기
    link: null as string | null,
  },
];

export default function ClassPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          선착순 15명 한정
        </span>

        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900 md:text-3xl">
          1:1 맞춤 컨설팅
        </h1>
        <p className="mt-3 text-sm text-neutral-500">
          팔로워는 있는데 수익이 안 된다면, 지금 1:1로 진단받아보세요
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
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

            {cls.link ? (
              <a href={cls.link} target="_blank" rel="noreferrer" className={BUTTON_CLASS}>
                신청하기
              </a>
            ) : (
              <ApplyButton productName={cls.title} amountKrw={cls.price} className={BUTTON_CLASS}>
                신청하기
              </ApplyButton>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
