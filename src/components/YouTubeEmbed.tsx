"use client";

import { useState } from "react";
import Image from "next/image";

export default function YouTubeEmbed({
  youtubeId,
  title,
  poster,
  overline,
  className = "",
}: {
  youtubeId: string;
  title: string;
  poster?: string;
  overline?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = poster ?? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <div className={`relative aspect-video overflow-hidden rounded-2xl bg-neutral-900 ${className}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex h-full w-full flex-col justify-between p-6 text-left focus:outline-none"
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover opacity-80 transition-opacity group-hover:opacity-65"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

          <span className="relative z-10 text-sm font-bold text-white">퍼스트 바이럴</span>

          <div className="relative z-10 flex items-end justify-between">
            <div>
              {overline && (
                <p className="text-sm font-medium text-white/80">{overline}</p>
              )}
              <p className="mt-1 max-w-xs text-lg font-bold leading-snug text-white">
                {title}
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-neutral-900 transition-transform group-hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
