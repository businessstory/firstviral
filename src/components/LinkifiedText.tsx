const URL_RE = /(https?:\/\/[^\s]+)/g;

// 본문 텍스트에서 http(s) 링크를 자동으로 클릭 가능한 링크로 바꿔 렌더링합니다.
export default function LinkifiedText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, lineIndex) => (
        <p key={lineIndex} className="mb-4 whitespace-pre-wrap leading-relaxed">
          {line.split(URL_RE).map((part, i) =>
            /^https?:\/\//.test(part) ? (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noreferrer"
                className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {part}
              </a>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      ))}
    </>
  );
}
