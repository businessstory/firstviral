import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <p>© 퍼스트 바이럴 | 이용약관</p>

        <div className="flex items-center gap-5">
          <Link href="/261" className="hover:text-neutral-800">
            무료 PDF
          </Link>
          <Link href="/terms" className="hover:text-neutral-800">
            이용약관
          </Link>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-neutral-500 hover:text-neutral-800"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
