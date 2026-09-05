const TONE_CLASS = {
  brand: "bg-brand-50 text-brand-700",
  gold: "bg-amber-50 text-amber-600",
  new: "bg-rose-50 text-rose-500",
  neutral: "bg-neutral-100 text-neutral-500",
} as const;

export default function Tag({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE_CLASS;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}
