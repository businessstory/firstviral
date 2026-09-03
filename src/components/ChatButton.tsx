export default function ChatButton() {
  return (
    <a
      href="https://open.kakao.com/o/sGuTwRLi"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#FEE500] px-5 py-3 text-sm font-bold text-[#3C1E1E] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#3C1E1E]/40 active:scale-95"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.8-.8 2.8-.9 3.2 0 0-.02.2.1.3.1.1.3 0 .3 0 .4-.1 3-2 3.5-2.4.7.1 1.5.2 2.3.2 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
      </svg>
      카카오톡 문의
    </a>
  );
}
