// 유튜브 "황금 키워드" 분석.
// - 자동완성(무료, 쿼터 없음)으로 사람들이 실제 검색하는 키워드를 모으고
// - YouTube Data API(무료 쿼터: 하루 10,000 유닛)로 검색 상위 영상의 조회수·채널 크기·업로드 날짜를 모아 점수를 매긴다.
// 쿼터 비용: 키워드 1개 = search.list 100 + videos.list 1 + channels.list 1 = 약 102 유닛 → 하루 약 95개까지 무료.

const API = "https://www.googleapis.com/youtube/v3";
const TOP_N = 15; // 분석할 상위 영상 수
const SEARCH_SIZE = 50; // 검색 1회(100유닛)에 50개까지 받아도 비용이 같아서, 넉넉히 받아 롱폼/숏폼을 걸러낸다
const SHORTS_MAX_SECONDS = 180; // 유튜브 쇼츠는 최대 3분
export const QUOTA_PER_KEYWORD = 102;
export const DAILY_FREE_QUOTA = 10_000;

const CONSONANTS = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

async function suggest(q: string): Promise<string[]> {
  const url =
    "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=ko&gl=kr&oe=utf-8&q=" +
    encodeURIComponent(q);
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as [string, string[]];
    return Array.isArray(data[1]) ? data[1] : [];
  } catch {
    return [];
  }
}

// 씨앗 키워드 + "씨앗 ㄱ", "씨앗 ㄴ"… 로 자동완성을 모아, 유망한 순서로 정렬한 후보 목록을 만든다.
// 쿼터를 쓰지 않는 신호만으로 순위를 매긴다:
//  - 여러 자동완성 목록에 반복해서 나올수록, 목록 앞쪽에 뜰수록 많이 검색되는 말
//  - 3단어 이상의 구체적인 키워드는 경쟁이 덜한 롱테일
export async function expandKeywords(seed: string): Promise<string[]> {
  const queries = [seed, ...CONSONANTS.map((c) => `${seed} ${c}`)];
  const lists = await Promise.all(queries.map(suggest));
  const seedKey = seed.replace(/\s+/g, "").toLowerCase();
  const stats = new Map<string, { text: string; hits: number; best: number }>();
  for (const list of lists) {
    list.forEach((kw, pos) => {
      const text = kw.trim();
      // "챗 gpt 무료"와 "챗gpt 무료"처럼 띄어쓰기만 다른 건 하나로 친다
      const key = text.replace(/\s+/g, "").toLowerCase();
      if (!text) return;
      const cur = stats.get(key);
      if (cur) {
        cur.hits += 1;
        cur.best = Math.min(cur.best, pos);
      } else stats.set(key, { text, hits: 1, best: pos });
    });
  }
  const rank = (key: string, v: { text: string; hits: number; best: number }) => {
    const words = v.text.split(/\s+/).length;
    return v.hits * 2 + (10 - v.best) / 10 + (words >= 3 ? 1 : 0) - (key === seedKey ? 3 : 0);
  };
  return [...stats.entries()].sort((a, b) => rank(b[0], b[1]) - rank(a[0], a[1])).map(([, v]) => v.text);
}

export type VideoFormat = "long" | "shorts";

// 영상 길이는 "PT1M30S" 같은 ISO 8601 형식으로 온다
function durationSeconds(iso: string) {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  return m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) : 0;
}

// 롱폼과 숏폼은 조회수 규모가 달라서 기준을 따로 둔다
const THRESHOLDS: Record<VideoFormat, { fullDemand: number; lowDemand: number; smallWinViews: number }> = {
  long: { fullDemand: 1_000_000, lowDemand: 3_000, smallWinViews: 10_000 },
  shorts: { fullDemand: 3_000_000, lowDemand: 10_000, smallWinViews: 50_000 },
};

export type VideoRow = {
  id: string;
  title: string;
  channel: string;
  views: number;
  subscribers: number | null; // 구독자 수 비공개 채널은 null
  ageDays: number;
  seconds: number;
};

export type KeywordReport = {
  keyword: string;
  format: VideoFormat;
  score: number; // 0~100
  verdict: "황금" | "괜찮음" | "레드오션" | "수요 적음";
  medianViews: number;
  medianAgeDays: number;
  smallChannelWins: number; // 구독자 1만 미만인데 조회수가 기준(롱폼 1만, 숏폼 5만) 이상인 영상 수
  bigChannelShare: number; // 구독자 100만 이상 채널 비율 (0~1)
  recentShare: number; // 최근 30일 안에 올라온 영상 비율 (0~1)
  videos: VideoRow[];
};

function median(nums: number[]) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const clamp = (n: number) => Math.max(0, Math.min(1, n));

export async function analyzeKeyword(keyword: string, apiKey: string, format: VideoFormat): Promise<KeywordReport> {
  const t = THRESHOLDS[format];
  // 숏폼은 "4분 미만" 필터로 검색해야 쇼츠가 충분히 잡힌다
  const durationFilter = format === "shorts" ? "&videoDuration=short" : "";
  const search = await fetch(
    `${API}/search?part=snippet&type=video&maxResults=${SEARCH_SIZE}${durationFilter}&regionCode=KR&relevanceLanguage=ko&q=${encodeURIComponent(keyword)}&key=${apiKey}`,
    { cache: "no-store" },
  );
  if (!search.ok) throw new Error(`search_failed_${search.status}`);
  const searchData = (await search.json()) as {
    items: { id: { videoId: string }; snippet: { channelId: string; title: string; channelTitle: string; publishedAt: string } }[];
  };
  const found = searchData.items ?? [];

  const vRes = await fetch(`${API}/videos?part=statistics,contentDetails&id=${found.map((i) => i.id.videoId).join(",")}&key=${apiKey}`, {
    cache: "no-store",
  });
  const vData = (await vRes.json()) as {
    items?: { id: string; statistics: { viewCount?: string }; contentDetails: { duration: string } }[];
  };
  const seconds = new Map((vData.items ?? []).map((v) => [v.id, durationSeconds(v.contentDetails.duration)]));

  // 검색 순위는 유지한 채 원하는 형식(롱폼/숏폼)만 남긴다
  const items = found
    .filter((i) => {
      const sec = seconds.get(i.id.videoId) ?? 0;
      return format === "shorts" ? sec > 0 && sec <= SHORTS_MAX_SECONDS : sec > SHORTS_MAX_SECONDS;
    })
    .slice(0, TOP_N);
  const channelIds = [...new Set(items.map((i) => i.snippet.channelId))].join(",");

  const cRes = await fetch(`${API}/channels?part=statistics&id=${channelIds}&key=${apiKey}`, { cache: "no-store" });
  const cData = (await cRes.json()) as {
    items?: { id: string; statistics: { subscriberCount?: string; hiddenSubscriberCount?: boolean } }[];
  };
  const views = new Map((vData.items ?? []).map((v) => [v.id, Number(v.statistics.viewCount ?? 0)]));
  const subs = new Map(
    (cData.items ?? []).map((c) => [
      c.id,
      c.statistics.hiddenSubscriberCount ? null : Number(c.statistics.subscriberCount ?? 0),
    ]),
  );

  const now = Date.now();
  const videos: VideoRow[] = items.map((i) => ({
    id: i.id.videoId,
    title: i.snippet.title,
    channel: i.snippet.channelTitle,
    views: views.get(i.id.videoId) ?? 0,
    subscribers: subs.get(i.snippet.channelId) ?? null,
    ageDays: Math.max(0, Math.round((now - new Date(i.snippet.publishedAt).getTime()) / 86_400_000)),
    seconds: seconds.get(i.id.videoId) ?? 0,
  }));

  const top10 = videos.slice(0, 10);
  const medianViews = median(top10.map((v) => v.views));
  const medianAgeDays = median(top10.map((v) => v.ageDays));
  const smallChannelWins = top10.filter((v) => v.subscribers !== null && v.subscribers < 10_000 && v.views >= t.smallWinViews).length;
  const known = top10.filter((v) => v.subscribers !== null);
  const bigChannelShare = known.length ? known.filter((v) => (v.subscribers ?? 0) >= 1_000_000).length / known.length : 0;
  const recentShare = top10.length ? top10.filter((v) => v.ageDays <= 30).length / top10.length : 0;

  // 점수 = 수요(40) + 작은 채널이 이기는 정도(30) + 상위 영상이 오래됨(15) + 대형 채널이 적음(15)
  const demand = clamp(Math.log10(Math.max(medianViews, 1)) / Math.log10(t.fullDemand)) * 40; // 롱폼 100만·숏폼 300만이면 만점
  const opportunity = clamp(smallChannelWins / 5) * 30; // 10개 중 5개 이상이면 만점
  const freshnessGap = clamp(medianAgeDays / 730) * 15; // 상위 영상이 평균 2년 이상 됐으면 만점
  const lowCompetition = (1 - bigChannelShare) * 15;
  const score = Math.round(demand + opportunity + freshnessGap + lowCompetition);

  const verdict: KeywordReport["verdict"] =
    top10.length < 5 || medianViews < t.lowDemand ? "수요 적음" : score >= 70 ? "황금" : score >= 50 ? "괜찮음" : "레드오션";

  return { keyword, format, score, verdict, medianViews, medianAgeDays, smallChannelWins, bigChannelShare, recentShare, videos };
}
