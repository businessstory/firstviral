"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void };
    };
  }
}

// 인스타그램 공식 임베드(퍼가기) 위젯.
// url 예시: https://www.instagram.com/p/Cxxxxxxxxxx/
export default function InstagramEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = document.getElementById("instagram-embed-script");

    function process() {
      window.instgrm?.Embeds.process();
    }

    if (existing) {
      process();
      return;
    }

    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = process;
    document.body.appendChild(script);
  }, [url]);

  return (
    <div ref={ref} className="flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ margin: 0, width: "100%", maxWidth: 400 }}
      />
    </div>
  );
}
