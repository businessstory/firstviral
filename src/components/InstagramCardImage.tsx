"use client";

import { useState } from "react";

// 인스타그램 CDN 썸네일 URL은 서명된 링크라 시간이 지나면 만료돼요.
// 만료돼서 로드가 실패하면 깨진 이미지 대신 자리를 비워둡니다.
export default function InstagramCardImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}
