// 인스타그램 공식 임베드 위젯(embed.js)은 음원 저작권 등의 이유로 공개 게시물이어도
// 개별 게시물 단위로 막히는 경우가 있음. 대신 노션/슬랙처럼 og:image, twitter:title 같은
// 공개 메타 태그만 가져와서 직접 카드 형태로 보여주면 훨씬 안정적으로 동작함.
export type InstagramPreview = {
  title: string;
  imageUrl: string | null;
  permalink: string;
};

// 일반 브라우저 UA로 요청하면 로그인 유도 페이지만 내려오는 경우가 있어서,
// 메타 태그를 안정적으로 내려주는 크롤러용 UA를 사용합니다.
const CRAWLER_USER_AGENT = "facebookexternalhit/1.1";

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)));
}

function extractMetaContent(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match ? decodeHtmlEntities(match[1]) : null;
}

export async function getInstagramPreview(permalink: string): Promise<InstagramPreview | null> {
  try {
    const res = await fetch(permalink, {
      headers: { "User-Agent": CRAWLER_USER_AGENT },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const title = extractMetaContent(html, /<meta name="twitter:title" content="([^"]*)"/);
    const imageUrl =
      extractMetaContent(html, /<meta property="og:image" content="([^"]*)"/) ??
      extractMetaContent(html, /<meta name="twitter:image" content="([^"]*)"/);

    if (!title && !imageUrl) return null;
    return { title: title ?? "인스타그램 게시물", imageUrl, permalink };
  } catch {
    return null;
  }
}
