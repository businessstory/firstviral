// 네이버 블로그 황금 키워드 찾기.
// - 네이버 검색광고 API(키워드 도구): 연관 키워드와 월간 검색량(PC+모바일) — 무료
// - 네이버 개발자센터 검색 API: 블로그 문서 수 — 무료(하루 25,000회)
// - 키가 없으면 네이버 자동완성만으로 후보를 보여준다(검색량·문서 수 없음)
import { createHmac } from "node:crypto";

export type NaverKeyword = {
  keyword: string;
  monthlySearch: number | null; // PC + 모바일 월간 검색량
  documents: number | null; // 블로그 문서 수
  ratio: number | null; // 문서 수 ÷ 월간 검색량 (낮을수록 경쟁이 적음)
  grade: "황금" | "좋음" | "보통" | "레드오션" | "검색량 적음" | "미확인";
};

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

export function naverKeysStatus() {
  return {
    searchAd: Boolean(process.env.NAVER_AD_CUSTOMER_ID && process.env.NAVER_AD_ACCESS_LICENSE && process.env.NAVER_AD_SECRET_KEY),
    openApi: Boolean(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET),
  };
}

// 검색광고 API는 "< 10" 처럼 문자열로 줄 때가 있다
const toCount = (v: unknown) => (typeof v === "number" ? v : typeof v === "string" ? (v.includes("<") ? 5 : Number(v) || 0) : 0);

async function searchAdKeywords(hint: string): Promise<{ keyword: string; monthlySearch: number }[]> {
  const uri = "/keywordstool";
  const ts = Date.now().toString();
  const sig = createHmac("sha256", process.env.NAVER_AD_SECRET_KEY!).update(`${ts}.GET.${uri}`).digest("base64");
  // 힌트 키워드는 띄어쓰기를 빼야 한다
  const res = await fetch(`https://api.searchad.naver.com${uri}?hintKeywords=${encodeURIComponent(hint.replace(/\s+/g, ""))}&showDetail=1`, {
    headers: {
      "X-Timestamp": ts,
      "X-API-KEY": process.env.NAVER_AD_ACCESS_LICENSE!,
      "X-Customer": process.env.NAVER_AD_CUSTOMER_ID!,
      "X-Signature": sig,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`searchad_${res.status}`);
  const data = (await res.json()) as { keywordList?: { relKeyword: string; monthlyPcQcCnt: unknown; monthlyMobileQcCnt: unknown }[] };
  return (data.keywordList ?? []).map((k) => ({ keyword: k.relKeyword, monthlySearch: toCount(k.monthlyPcQcCnt) + toCount(k.monthlyMobileQcCnt) }));
}

export async function blogDocumentCount(keyword: string): Promise<number | null> {
  if (!naverKeysStatus().openApi) return null;
  const res = await fetch(`https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(keyword)}&display=1`, {
    headers: { "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!, "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET! },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return ((await res.json()) as { total?: number }).total ?? null;
}

async function autocomplete(q: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(q)}&con=1&frm=nv&ans=2&r_format=json&r_enc=UTF-8&r_unicode=0&t_koreng=1&run=2&rev=4&q_enc=UTF-8&st=100`,
      { headers: { "User-Agent": UA }, cache: "no-store" },
    );
    const data = (await res.json()) as { items?: [string][][] };
    return (data.items?.[0] ?? []).map((x) => x[0]);
  } catch {
    return [];
  }
}

function grade(monthlySearch: number | null, ratio: number | null): NaverKeyword["grade"] {
  if (monthlySearch === null || ratio === null) return "미확인";
  if (monthlySearch < 300) return "검색량 적음";
  if (ratio <= 5) return "황금";
  if (ratio <= 20) return "좋음";
  if (ratio <= 100) return "보통";
  return "레드오션";
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

// 주제를 넣으면 황금 키워드 후보를 점수순으로 돌려준다
export async function findGoldenKeywords(topic: string): Promise<{ keywords: NaverKeyword[]; source: "official" | "autocomplete" }> {
  const keys = naverKeysStatus();
  const topicTokens = topic.split(/\s+/).filter(Boolean).map((t) => t.toLowerCase());
  const relevant = (k: string) => topicTokens.some((t) => k.replace(/\s+/g, "").toLowerCase().includes(t));

  if (keys.searchAd) {
    const related = (await searchAdKeywords(topic)).filter((k) => relevant(k.keyword));
    // 검색량 상위 40개만 문서 수를 확인 (개발자센터 API 하루 25,000회 무료 한도 안)
    const top = related.sort((a, b) => b.monthlySearch - a.monthlySearch).slice(0, 40);
    const docs = await mapLimit(top, 5, (k) => blogDocumentCount(k.keyword));
    const keywords = top.map((k, i) => {
      const documents = docs[i];
      const ratio = documents !== null && k.monthlySearch > 0 ? documents / k.monthlySearch : null;
      return { keyword: k.keyword, monthlySearch: k.monthlySearch, documents, ratio, grade: grade(k.monthlySearch, ratio) };
    });
    const order = ["황금", "좋음", "보통", "레드오션", "검색량 적음", "미확인"];
    keywords.sort((a, b) => order.indexOf(a.grade) - order.indexOf(b.grade) || (b.monthlySearch ?? 0) - (a.monthlySearch ?? 0));
    return { keywords, source: "official" };
  }

  // 키가 없을 때: 자동완성(ㄱ~ㅎ)으로 실제 검색어 후보만 모은다
  const lists = await mapLimit([topic, ...["ㄱ", "ㄴ", "ㄷ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅎ"].map((c) => `${topic} ${c}`)], 4, autocomplete);
  const seen = new Set<string>();
  const words = lists.flat().filter((k) => {
    const key = k.replace(/\s+/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const docs = await mapLimit(words.slice(0, 30), 5, (k) => blogDocumentCount(k));
  return {
    keywords: words.slice(0, 30).map((k, i) => ({ keyword: k, monthlySearch: null, documents: docs[i], ratio: null, grade: "미확인" })),
    source: "autocomplete",
  };
}
