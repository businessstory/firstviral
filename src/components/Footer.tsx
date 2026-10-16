import Link from "next/link";

// 애플 footer: parchment 배경, 작은 글씨, 촘촘하지만 정돈된 링크
export default function Footer() {
  return (
    <footer className="bg-brand-50 text-[12px] text-neutral-600">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 border-b border-hairline pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold text-brand-950">비즈니스 스토리</p>
            <div className="flex items-center gap-4 md:hidden">
              <a href="https://www.instagram.com/_business.story/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-brand-950">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              </a>
              <a href="https://www.youtube.com/@Betory100/featured" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-brand-950">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
              </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 whitespace-nowrap">
            <span className="hidden items-center gap-4 md:order-last md:flex">
            <a href="https://www.instagram.com/_business.story/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-brand-950">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@Betory100/featured" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-brand-950">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
              </svg>
            </a>
            </span>
            <Link href="/261" className="hover:text-brand-950 hover:underline">무료 자료실</Link>
            <Link href="/361" className="hover:text-brand-950 hover:underline">컨설팅 신청</Link>
            <Link href="/terms" className="hover:text-brand-950 hover:underline">이용약관</Link>
            <Link href="/privacy" className="font-semibold text-brand-950 hover:underline">개인정보처리방침</Link>
          </div>
        </div>
        <div className="mt-5 leading-relaxed text-ink-muted">
          {/* 휴대폰에서는 항목마다 한 줄씩, PC에서는 이어서 */}
          <p className="flex flex-col md:block">
            {["비즈니스 스토리", "대표: 심정혁", "주소: 서울 서초구 서초대로 243 서현빌딩 4층", "사업자등록번호: 781-40-01405", "통신판매업신고번호: 제2026-서울광진-0278호", "이메일: tlawjdgur11@naver.com"].map((t, i) => (
              <span key={t} className="whitespace-nowrap md:whitespace-normal">
                {i > 0 && <span className="hidden md:inline"> | </span>}
                {t}
              </span>
            ))}
          </p>
          <p className="mt-3">Copyright © 2026 Business Story. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
