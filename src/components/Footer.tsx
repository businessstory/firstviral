import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-col gap-4 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© 퍼스트 바이럴 | 이용약관</p>

          <div className="flex items-center gap-5">
            <Link href="/261" className="hover:text-brand-700">
              무료 자료실
            </Link>
            <Link href="/terms" className="hover:text-brand-700">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-brand-700">
              개인정보처리방침
            </Link>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-neutral-500 hover:text-brand-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-black/5 pt-6 text-xs leading-relaxed text-neutral-400">
          <p>
            비즈니스 스토리 | 대표: 심정혁 | 주소: 서울 서초구 서초대로 243 서현빌딩 4층
          </p>
          <p className="mt-1">
            사업자등록번호: 781-40-01405 | 통신판매업신고번호: 제2026-서울광진-0278호 | 이메일: tlawjdgur11@naver.com
          </p>
          <p className="mt-2">© 2026 Business Story. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
