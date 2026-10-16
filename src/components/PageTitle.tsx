// 애플 스타일 페이지 머리말: parchment 배경 띠 + 촘촘한 큰 제목 + 한 줄 설명.
// 제목·설명은 화면이 좁아져도 줄이 넘어가지 않도록 글자 크기를 화면 폭에 맞춰 줄인다.
export default function PageTitle({ title, desc, eyebrow }: { title: string; desc?: string; eyebrow?: string }) {
  return (
    <section className="bg-brand-50">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pb-14 md:pt-20">
        {eyebrow && <p className="line text-[min(3.6vw,14px)] font-semibold text-brand-700">{eyebrow}</p>}
        <h1 className="line mt-1 text-[min(9.5vw,48px)] font-semibold leading-[1.08] text-brand-950">{title}</h1>
        {desc && <p className="line mt-3 text-[min(4.3vw,21px)] text-ink-muted">{desc}</p>}
      </div>
    </section>
  );
}
