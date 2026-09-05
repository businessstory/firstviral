import PdfApplicationForm from "@/components/PdfApplicationForm";

export const metadata = {
  title: "인스타그램 100만 뷰 공식 3가지 PDF | 퍼스트 바이럴",
};

export default function MillionViewsPdfPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <div className="space-y-3 text-lg font-bold leading-relaxed text-neutral-900">
        <p>✅ 6개월만에 0 → 3.3만 인플루언서가 된 비밀 공개</p>
        <p>✅ 인스타그램 수익화 전략 공개</p>
        <p>✅ 300만 뷰 공식 5가지 최초 공개!</p>
      </div>

      <p className="mt-8 text-base font-semibold leading-relaxed text-neutral-700">
        😎 수강생 누적 조회수 1억 뷰를 달성한
        <br />
        비즈니스 스토리입니다.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <p className="text-sm font-bold text-neutral-500">[목차 일부만 공개합니다]</p>
        <ol className="mt-3 space-y-1.5 text-sm leading-relaxed text-neutral-700">
          <li>1. 알고리즘 해킹, 세팅 전략</li>
          <li>2. 그로스해킹 전략</li>
          <li>3. 100만 뷰 조회수 공식</li>
          <li>4. 스토리텔링 공식</li>
          <li className="text-neutral-400">등등...</li>
        </ol>
      </div>

      <p className="mt-8 text-base font-bold leading-relaxed text-neutral-900">
        업계 최고의 인스타그램 공식 &ldquo;5가지&rdquo;를
        <br />
        꾹꾹 눌러담았습니다
      </p>

      <p className="mt-6 text-sm leading-relaxed text-neutral-600">
        내용이 좋아서 그런지 많은 분들이
        <br />
        &lsquo;인스타그램 성공공식 5가지 PDF&rsquo;를 읽고 너무 도움됐다고
        <br />
        🎁스타벅스 기프티콘도 보내주십니다.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pdf/million-views-reviews.png" alt="수강생 후기" className="w-full" />
      </div>

      <div className="mt-12">
        <PdfApplicationForm />
      </div>
    </article>
  );
}
