"use client";

import { useState } from "react";

const COMING_SOON_MESSAGE = "성과 영상 편집중입니다. 빠른 시일 내에 보여드리겠습니다.";

export default function ReviewsList({ names }: { names: string[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 overflow-y-auto lg:max-h-[400px]">
        {names.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setActiveIndex(i);
              setMessage(COMING_SOON_MESSAGE);
            }}
            className={`flex items-center gap-3 rounded-xl p-2 text-left transition-colors ${
              activeIndex === i ? "bg-brand-50" : "hover:bg-neutral-50"
            }`}
          >
            <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-brand-950">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="9" opacity="0.4" />
                <path d="M10 9l5 3-5 3z" fill="white" stroke="none" />
              </svg>
            </span>
            <p className="text-sm font-semibold text-neutral-800">{name}</p>
          </button>
        ))}
      </div>

      {message && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
          {message}
        </p>
      )}
    </div>
  );
}
