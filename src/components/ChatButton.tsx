export default function ChatButton() {
  return (
    <a
      href="#"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-neutral-900 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 2-2z" />
      </svg>
      문의
    </a>
  );
}
