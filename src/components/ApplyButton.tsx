"use client";

import { useState } from "react";

export default function ApplyButton({
  productName,
  amountKrw,
  className = "",
  children,
}: {
  productName: string;
  amountKrw: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [notReady, setNotReady] = useState(false);

  async function handleClick() {
    setLoading(true);
    setNotReady(false);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, amountKrw }),
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
        return;
      }

      setNotReady(true);
    } catch {
      setNotReady(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {loading ? "연결 중..." : children}
      </button>
      {notReady && (
        <p className="mt-2 text-xs text-neutral-400">
          결제 연동 준비 중이에요. 우측 하단 문의 버튼으로 신청해주세요.
        </p>
      )}
    </div>
  );
}
