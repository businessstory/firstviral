// 애플 스타일 작은 라벨: 장식 없이 연한 면 + 작은 글씨
const TONE_CLASS = {
  brand: "bg-brand-50 text-brand-950",
  gold: "bg-brand-50 text-brand-700",
  new: "bg-[#fff1ec] text-[#bf4800]",
  neutral: "bg-brand-50 text-ink-muted",
} as const;

export default function Tag({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE_CLASS;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TONE_CLASS[tone]}`}>
      {children}
    </span>
  );
}
