// 네이버 블로그 탭 1~5위 글을 열어서 상위노출 공통점, 광고 여부, 트래픽 작업 의심 신호를 분석한다.
import { parse } from "node-html-parser";

const DESKTOP_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const TOP = 5;
const DAY = 86_400_000;

export type PostAnalysis = {
  rank: number;
  blogId: string;
  logNo: string;
  url: string;
  title: string;
  publishedAt: number | null;
  chars: number;
  images: number;
  videos: number;
  quotes: number;
  subheadings: number;
  tables: number;
  maps: number;
  keywordExact: number; // 키워드 그대로(띄어쓰기 포함) 반복 수
  keywordTokens: Record<string, number>;
  keywordInTitle: boolean;
  titleStartsWithKeyword: boolean;
  keywordInIntro: boolean; // 본문 첫 200자 안에 키워드
  tags: string[];
  likes: number | null;
  comments: number | null;
  externalDomains: string[];
  postsPerDay: number | null; // 이 블로그의 최근 글 작성 속도
  ad: { verdict: "광고(표기 있음)" | "광고 의심(표기 없음)" | "일반 글"; reasons: string[] };
  traffic: { level: "없음" | "낮음" | "높음"; reasons: string[] };
};

export type KeywordAnalysis = {
  keyword: string;
  analyzedAt: string;
  posts: PostAnalysis[];
  summary: {
    titleLength: number;
    chars: number;
    images: number;
    quotes: number;
    subheadings: number;
    keywordExact: number;
    tags: number;
    likes: number;
    comments: number;
    freshDays: number; // 상위 글이 올라온 지 며칠(중간값)
    titleStartsWithKeyword: number; // 5개 중 몇 개
    keywordInIntro: number;
    adPosts: number;
    suspiciousPosts: number;
  };
  subKeywords: string[];
  popularTags: string[];
  titlePatterns: string[];
};

const median = (nums: number[]) => {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};
const count = (text: string, word: string) => (word ? text.split(word).length - 1 : 0);
const squash = (s: string) => s.replace(/\s+/g, "");

async function getText(url: string, ua: string, referer?: string) {
  const res = await fetch(url, { headers: { "User-Agent": ua, ...(referer ? { Referer: referer } : {}) }, cache: "no-store" });
  if (!res.ok) throw new Error(`fetch_${res.status}`);
  return res.text();
}

// 블로그 탭 검색 결과 순서대로 글 목록
export async function topBlogPosts(keyword: string): Promise<{ blogId: string; logNo: string }[]> {
  const html = await getText(`https://search.naver.com/search.naver?ssc=tab.blog.all&sm=tab_jum&query=${encodeURIComponent(keyword)}`, DESKTOP_UA);
  const seen = new Set<string>();
  const out: { blogId: string; logNo: string }[] = [];
  for (const m of html.matchAll(/href="https:\/\/blog\.naver\.com\/([A-Za-z0-9_-]+)\/(\d{9,})"[^>]*>([\s\S]*?)<\/a>/g)) {
    const text = m[3].replace(/<[^>]+>/g, "").trim();
    const key = `${m[1]}/${m[2]}`;
    if (text.length < 8 || seen.has(key)) continue;
    seen.add(key);
    out.push({ blogId: m[1], logNo: m[2] });
  }
  return out.slice(0, TOP);
}

async function likeCount(blogId: string, logNo: string): Promise<number | null> {
  try {
    const id = `${blogId}_${logNo}`;
    const text = await getText(
      `https://apis.naver.com/blogserver/like/v1/search/contents?suppress_response_codes=true&pool=blogid&q=BLOG%5B${id}%5D&isDuplication=false&cssIds=MULTI_MOBILE%2CBLOG_MOBILE&displayId=BLOG`,
      MOBILE_UA,
      `https://m.blog.naver.com/${blogId}/${logNo}`,
    );
    const data = JSON.parse(text) as { contents?: { reactions?: { count: number }[] }[] };
    return (data.contents?.[0]?.reactions ?? []).reduce((sum, r) => sum + (r.count ?? 0), 0);
  } catch {
    return null;
  }
}

// 최근 30개 글의 작성 간격으로 하루 평균 글 수 (하루 수십 개면 "공장형" 블로그 신호)
async function postsPerDay(blogId: string): Promise<number | null> {
  try {
    const text = await getText(`https://m.blog.naver.com/api/blogs/${blogId}/post-list?categoryNo=0&itemCount=30&page=1`, MOBILE_UA, "https://m.blog.naver.com/");
    const items = (JSON.parse(text) as { result?: { items?: { addDate: number }[] } }).result?.items ?? [];
    const dates = items.map((i) => i.addDate).filter(Boolean);
    if (dates.length < 5) return null;
    const span = Math.max(1, (Math.max(...dates) - Math.min(...dates)) / DAY);
    return Math.round((dates.length / span) * 10) / 10;
  } catch {
    return null;
  }
}

const DISCLOSURE = /소정의\s*(원고료|수수료|광고비)|협찬|광고\s*(포함|글)|유료\s*광고|제휴\s*마케팅|파트너스\s*활동|일정액의\s*수수료|업체로부터\s*(제공|지원)|제품을\s*(제공|지원)\s*받|체험단/;
const AFFILIATE = /[?&](ref|referral|aff|utm_source)=|\/ref\/|coupang|link\.coupang|partners|vo\.la|bit\.ly|han\.gl|me2\.do|linktr\.ee|litt\.ly|smartstore\.naver/;

async function analyzePost(keyword: string, rank: number, blogId: string, logNo: string): Promise<{ post: PostAnalysis; body: string }> {
  const url = `https://m.blog.naver.com/${blogId}/${logNo}`;
  const [html, likes, perDay] = await Promise.all([
    getText(`https://m.blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}`, MOBILE_UA),
    likeCount(blogId, logNo),
    postsPerDay(blogId),
  ]);
  const root = parse(html);
  const main = root.querySelector(".se-main-container") ?? root.querySelector("#viewTypeSelector") ?? root.querySelector(".post_ct");
  const body = (main?.structuredText ?? "").replace(/​/g, "");
  const flat = body.replace(/\s+/g, " ").trim();
  const title = (root.querySelector(".se-title-text")?.text ?? root.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "").trim();
  const addDate = Number(html.match(/addDate="(\d{12,})"/)?.[1] ?? 0) || null;
  const comments = Number(html.match(/commentCount="(\d+)"/)?.[1] ?? NaN);
  const tags = (html.match(/TagName\s*=\s*"([^"]*)"/)?.[1] ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const links = (main?.querySelectorAll("a") ?? []).map((a) => a.getAttribute("href") ?? "").filter((h) => /^https?:/.test(h));
  const external = links.filter((h) => !/naver\.(com|me)|pstatic\.net/.test(h));
  const externalDomains = [...new Set(external.map((h) => { try { return new URL(h).hostname; } catch { return ""; } }).filter(Boolean))];
  const kwSquash = squash(keyword);

  // 광고 판별
  const adReasons: string[] = [];
  const disclosed = DISCLOSURE.test(flat);
  if (disclosed) adReasons.push("본문에 광고·협찬·원고료 표기가 있어요");
  const affiliate = external.filter((h) => AFFILIATE.test(h));
  if (affiliate.length) adReasons.push(`추천인·제휴 링크 ${affiliate.length}개 (${[...new Set(affiliate.map((h) => new URL(h).hostname))].join(", ")})`);
  if (external.length >= 3 && externalDomains.length === 1) adReasons.push(`같은 외부 사이트로 가는 링크를 ${external.length}번 반복해요`);
  const adVerdict: PostAnalysis["ad"]["verdict"] = disclosed ? "광고(표기 있음)" : adReasons.length ? "광고 의심(표기 없음)" : "일반 글";

  // 트래픽 작업 의심 신호 (확정이 아니라 "의심")
  const trafficReasons: string[] = [];
  const ageDays = addDate ? (Date.now() - addDate) / DAY : null;
  if (likes !== null && !Number.isNaN(comments) && likes >= 20 && comments === 0) trafficReasons.push(`공감 ${likes}개인데 댓글이 0개예요`);
  if (likes !== null && ageDays !== null && ageDays < 2 && likes >= 15) trafficReasons.push(`올린 지 ${Math.round(ageDays * 24)}시간 만에 공감 ${likes}개`);
  if (perDay !== null && perDay >= 5) trafficReasons.push(`이 블로그는 하루 평균 ${perDay}개씩 글을 올려요 (공장형 블로그 의심)`);
  if (flat.length > 0 && body.replace(/\s/g, "").length < 600) trafficReasons.push("글이 매우 짧은데 상위에 있어요");

  const post: PostAnalysis = {
    rank,
    blogId,
    logNo,
    url,
    title,
    publishedAt: addDate,
    chars: body.replace(/\s/g, "").length,
    images: main?.querySelectorAll("img.se-image-resource").length ?? 0,
    videos: main?.querySelectorAll(".se-video").length ?? 0,
    quotes: main?.querySelectorAll(".se-quotation").length ?? 0,
    subheadings:
      (main?.querySelectorAll(".se-sectionTitle").length ?? 0) +
      (main?.querySelectorAll(".se-fs-fs19, .se-fs-fs24, .se-fs-fs28, .se-fs-fs34").filter((e) => e.text.trim().length > 3).length ?? 0),
    tables: main?.querySelectorAll(".se-table").length ?? 0,
    maps: main?.querySelectorAll(".se-placesMap, .se-map").length ?? 0,
    keywordExact: count(flat, keyword),
    keywordTokens: Object.fromEntries(keyword.split(/\s+/).map((t) => [t, count(flat, t)])),
    keywordInTitle: squash(title).includes(kwSquash),
    titleStartsWithKeyword: squash(title).startsWith(kwSquash),
    keywordInIntro: squash(flat.slice(0, 200)).includes(kwSquash),
    tags,
    likes,
    comments: Number.isNaN(comments) ? null : comments,
    externalDomains,
    postsPerDay: perDay,
    ad: { verdict: adVerdict, reasons: adReasons },
    traffic: { level: trafficReasons.length >= 2 ? "높음" : trafficReasons.length === 1 ? "낮음" : "없음", reasons: trafficReasons },
  };
  // 본문은 서브 키워드 계산에만 쓰고 응답에는 싣지 않는다
  return { post, body: flat };
}

const STOP = new Set(
  "그리고 하지만 그래서 있는 있습니다 합니다 하는 것이 있어요 해요 있고 하고 없는 많이 가장 바로 먼저 직접 처음 하나 이제 다른 지금 그냥 어떻게 무엇 이렇게 그렇게 아니라 대한 없이 같아요 됩니다 했습니다 있다 했다 한다 하면 하는데 했는데 있는데 생각 부분 정도 내용 확인 사용 방법 이유 오늘 저는 제가 우리 위해 통해 경우 때문에 같은 정말 너무 그런 이런 함께 실제 다음 이번 경우에 그대로 정리 사람 사람들 그런데"
    .split(" "),
);

export async function analyzeKeyword(keyword: string): Promise<KeywordAnalysis> {
  const list = await topBlogPosts(keyword);
  const settled = await Promise.allSettled(list.map((p, i) => analyzePost(keyword, i + 1, p.blogId, p.logNo)));
  const done = settled.filter((s): s is PromiseFulfilledResult<{ post: PostAnalysis; body: string }> => s.status === "fulfilled").map((s) => s.value);
  const posts = done.map((d) => d.post);

  // 여러 상위 글이 같은 외부 사이트로 링크하면 "같은 업체 홍보 묶음" 신호
  const domainCount = new Map<string, number>();
  posts.forEach((p) => p.externalDomains.forEach((d) => domainCount.set(d, (domainCount.get(d) ?? 0) + 1)));
  for (const p of posts) {
    const shared = p.externalDomains.filter((d) => (domainCount.get(d) ?? 0) >= 2);
    if (shared.length) {
      p.ad.reasons.push(`상위 글 여러 개가 같은 사이트(${shared.join(", ")})로 연결돼요 (같은 업체 원고 배포 의심)`);
      if (p.ad.verdict === "일반 글") p.ad.verdict = "광고 의심(표기 없음)";
    }
  }

  // 서브 키워드: 상위 글 3개 이상에 공통으로 자주 나온 단어
  const kwTokens = new Set(keyword.split(/\s+/));
  const freq = new Map<string, number>();
  const docFreq = new Map<string, number>();
  for (const { body } of done) {
    const words = (body.match(/[가-힣A-Za-z]{2,}/g) ?? [])
      .map((w) => w.replace(/(은|는|이|가|을|를|에|의|로|으로|과|와|도|만|에서|까지|부터|이나|처럼|보다|에게|한테)$/, ""))
      .filter((w) => w.length >= 2 && !STOP.has(w) && !kwTokens.has(w));
    words.forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1));
    new Set(words).forEach((w) => docFreq.set(w, (docFreq.get(w) ?? 0) + 1));
  }
  const minDocs = Math.min(3, Math.max(2, posts.length - 2));
  const subKeywords = [...freq.entries()]
    .filter(([w]) => (docFreq.get(w) ?? 0) >= minDocs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w);

  const tagFreq = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((t) => tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1)));
  const popularTags = [...tagFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);

  const titles = posts.map((p) => p.title);
  const titlePatterns = [
    titles.filter((t) => /후기|직접|해보|해본|써보|경험/.test(t)).length && `경험형 ("직접 해본", "후기") ${titles.filter((t) => /후기|직접|해보|해본|써보|경험/.test(t)).length}개`,
    titles.filter((t) => /방법|하는\s?법|노하우|팁|정리/.test(t)).length && `방법·정리형 ("~하는 법", "총정리") ${titles.filter((t) => /방법|하는\s?법|노하우|팁|정리/.test(t)).length}개`,
    titles.filter((t) => /\?/.test(t)).length && `질문형 ("~할까?") ${titles.filter((t) => /\?/.test(t)).length}개`,
    titles.filter((t) => /\d/.test(t)).length && `숫자형 ("5가지", "2026") ${titles.filter((t) => /\d/.test(t)).length}개`,
  ].filter(Boolean) as string[];

  const fresh = posts.filter((p) => p.publishedAt).map((p) => (Date.now() - (p.publishedAt ?? 0)) / DAY);
  return {
    keyword,
    analyzedAt: new Date().toISOString(),
    posts,
    summary: {
      titleLength: median(posts.map((p) => p.title.length)),
      chars: median(posts.map((p) => p.chars)),
      images: median(posts.map((p) => p.images)),
      quotes: median(posts.map((p) => p.quotes)),
      subheadings: median(posts.map((p) => p.subheadings)),
      keywordExact: median(posts.map((p) => p.keywordExact)),
      tags: median(posts.map((p) => p.tags.length)),
      likes: median(posts.map((p) => p.likes ?? 0)),
      comments: median(posts.map((p) => p.comments ?? 0)),
      freshDays: Math.round(median(fresh)),
      titleStartsWithKeyword: posts.filter((p) => p.titleStartsWithKeyword).length,
      keywordInIntro: posts.filter((p) => p.keywordInIntro).length,
      adPosts: posts.filter((p) => p.ad.verdict !== "일반 글").length,
      suspiciousPosts: posts.filter((p) => p.traffic.level !== "없음").length,
    },
    subKeywords,
    popularTags,
    titlePatterns,
  };
}
