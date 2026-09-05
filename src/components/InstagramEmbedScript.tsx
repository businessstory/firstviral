"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// 본문에 있는 <blockquote class="instagram-media"> 들을 실제 인스타그램
// 미리보기(썸네일 + 재생 버튼)로 바꿔주는 인스타그램 공식 임베드 스크립트를 로드합니다.
export default function InstagramEmbedScript() {
  useEffect(() => {
    const process = () => window.instgrm?.Embeds?.process();

    if (window.instgrm) {
      process();
      return;
    }

    const existing = document.getElementById("instagram-embed-script");
    if (existing) {
      existing.addEventListener("load", process);
      return () => existing.removeEventListener("load", process);
    }

    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = process;
    document.body.appendChild(script);
  }, []);

  return null;
}
