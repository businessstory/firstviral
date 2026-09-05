const URL_RE = /(https?:\/\/[^\s]+)/g;
const INSTAGRAM_RE = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[^\s]+$/;

// 본문 텍스트에서 http(s) 링크를 자동으로 클릭 가능한 링크로 바꿔 렌더링합니다.
// 인스타그램 게시물/릴스 링크가 한 줄을 단독으로 차지하면 실제 미리보기로 임베드합니다.
export default function LinkifiedText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, lineIndex) => {
        const trimmed = line.trim();

        if (INSTAGRAM_RE.test(trimmed)) {
          return (
            <blockquote
              key={lineIndex}
              className="instagram-media"
              data-instgrm-permalink={trimmed}
              data-instgrm-version="14"
              style={{ margin: "16px auto", maxWidth: 540, width: "100%" }}
            >
              <a href={trimmed} target="_blank" rel="noreferrer">
                인스타그램에서 게시물 보기
              </a>
            </blockquote>
          );
        }

        if (trimmed.length === 0) {
          return <div key={lineIndex} className="h-2" />;
        }

        return (
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
        );
      })}
    </>
  );
}
