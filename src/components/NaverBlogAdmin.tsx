"use client";

import { useState } from "react";
import type { KeywordAnalysis, PostAnalysis } from "@/lib/naver/analysis";
import type { NaverKeyword } from "@/lib/naver/keywords";
import AdminShell from "./AdminShell";

type Keys = { searchAd: boolean; openApi: boolean };

const BTN =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const INPUT =
  "w-full rounded-xl border border-neutral-300 px-4 py-3 text-[15px] outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

const GRADE_STYLE: Record<NaverKeyword["grade"], string> = {
  황금: "bg-accent-gold text-brand-950",
  좋음: "bg-brand-100 text-brand-800",
  보통: "bg-neutral-100 text-neutral-600",
  레드오션: "bg-red-100 text-red-700",
  "검색량 적음": "bg-neutral-100 text-neutral-400",
  미확인: "bg-neutral-100 text-neutral-500",
};
const AD_STYLE: Record<PostAnalysis["ad"]["verdict"], string> = {
  "광고(표기 있음)": "bg-amber-100 text-amber-800",
  "광고 의심(표기 없음)": "bg-red-100 text-red-700",
  "일반 글": "bg-brand-100 text-brand-800",
};
const TRAFFIC_STYLE: Record<PostAnalysis["traffic"]["level"], string> = {
  없음: "bg-brand-100 text-brand-800",
  낮음: "bg-amber-100 text-amber-800",
  높음: "bg-red-100 text-red-700",
};

const fmt = (n: number | null) => (n === null ? "-" : n >= 10_000 ? `${(n / 10_000).toFixed(n >= 100_000 ? 0 : 1)}만` : n.toLocaleString("ko-KR"));
const ago = (ts: number | null) => {
  if (!ts) return "-";
  const h = (Date.now() - ts) / 3_600_000;
  return h < 24 ? `${Math.max(1, Math.round(h))}시간 전` : `${Math.round(h / 24)}일 전`;
};

export default function NaverBlogAdmin({ keys }: { keys: Keys }) {
  const [topic, setTopic] = useState("");
  const [direct, setDirect] = useState("");
  const [keywords, setKeywords] = useState<NaverKeyword[]>([]);
  const [source, setSource] = useState<"official" | "autocomplete" | null>(null);
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState<"keywords" | "analyze" | null>(null);
  const [analyzing, setAnalyzing] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  async function findKeywords() {
    if (!topic.trim()) return;
    setLoading("keywords");
    setMessage("");
    try {
      const res = await fetch("/api/naver-blog/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setKeywords(data.keywords);
      setSource(data.source);
      if (!data.keywords.length) setMessage("관련 키워드를 찾지 못했어요. 더 짧은 주제로 검색해 보세요.");
    } catch (e) {
      setMessage(
        e instanceof Error && e.message.startsWith("searchad")
          ? "네이버 검색광고 API 키를 확인해 주세요. (키가 틀렸거나 권한이 없어요)"
          : "키워드를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    }
    setLoading(null);
  }

  async function analyze(kw: string) {
    setLoading("analyze");
    setAnalyzing(kw);
    setMessage("");
    setAnalysis(null);
    setPrompt("");
    try {
      const res = await fetch("/api/naver-blog/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data.analysis);
      setPrompt(data.prompt);
      requestAnimationFrame(() => document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setMessage(e instanceof Error && e.message === "no_posts" ? "이 키워드는 블로그 검색 결과가 없어요." : "네이버 글을 분석하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
    setLoading(null);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage("복사하지 못했어요. 글상자를 눌러 전체 선택(⌘A) 후 복사해 주세요.");
    }
  }

  const busy = loading !== null;

  return (
    <AdminShell title="블로그 상위노출">
      {/* 소개 */}
      <div className="rounded-2xl bg-brand-950 p-6 text-white shadow-[0_12px_30px_rgba(11,43,33,0.18)]">
        <p className="text-lg font-bold">주제만 넣으면 황금 키워드 → 상위 글 분석 → 글쓰기 지시문까지</p>
        <p className="mt-2 text-sm leading-relaxed text-brand-100/80">
          네이버 블로그 1~5위 글을 직접 열어 제목·글자 수·사진·키워드·태그를 분석하고, 광고 글과 트래픽 작업 의심 신호까지 표시해요.
        </p>
        <ol className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          {["주제 입력", "황금 키워드 고르기", "상위 1~5위 분석", "글쓰기 지시문 복사", "실제 사진·경험 넣어 발행"].map((s, i) => (
            <li key={s} className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
              <span className="mr-1 text-accent-gold">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* API 키 상태 */}
      {(!keys.searchAd || !keys.openApi) && (
        <details className="mt-4 rounded-2xl border border-accent-gold/60 bg-accent-gold/10 p-5 text-sm leading-relaxed text-neutral-700">
          <summary className="cursor-pointer font-bold text-neutral-900">
            네이버 API 키를 연결하면 월 검색량과 문서 수로 정확한 황금 키워드를 찾아요 (무료) · 연결 방법 보기
          </summary>
          <ul className="mt-3 space-y-1">
            <li>{keys.searchAd ? "✅" : "⬜"} 네이버 검색광고 API (월 검색량): searchad.naver.com → 도구 → API 사용 관리</li>
            <li>{keys.openApi ? "✅" : "⬜"} 네이버 개발자센터 검색 API (블로그 문서 수): developers.naver.com → 애플리케이션 등록 → 검색</li>
          </ul>
          <p className="mt-2 text-neutral-500">키가 없어도 자동완성 키워드와 상위 글 분석, 글쓰기 지시문은 바로 쓸 수 있어요.</p>
        </details>
      )}

      {/* 1. 황금 키워드 */}
      <section className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
        <StepTitle n={1} title="황금 키워드 찾기" desc="주제를 넣으면 네이버 연관 키워드를 모아 검색량 대비 문서 수가 적은 순으로 보여 드려요." />
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            findKeywords();
          }}
        >
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="주제 입력 (예: 인스타그램, 릴스, 인스타 광고)" aria-label="주제" className={INPUT} />
          <button type="submit" disabled={!topic.trim() || busy} className={`${BTN} shrink-0 bg-accent-gold py-3 text-brand-950 shadow-[0_8px_20px_rgba(232,196,104,0.35)] hover:bg-[#f0d07c]`}>
            {loading === "keywords" && <Spinner />}황금 키워드 찾기
          </button>
        </form>

        {keywords.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
            {source === "autocomplete" && (
              <p className="bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500">
                네이버 API 키가 없어 자동완성 키워드만 보여 드려요. 키를 연결하면 월 검색량·문서 수·등급이 표시돼요.
              </p>
            )}
            <div className="hidden grid-cols-[1fr_90px_90px_80px_80px_110px] gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-2.5 text-xs font-semibold text-neutral-500 md:grid">
              <span>키워드</span>
              <span className="text-right">월 검색량</span>
              <span className="text-right">블로그 문서</span>
              <span className="text-right">경쟁 비율</span>
              <span className="text-center">등급</span>
              <span />
            </div>
            <ul className="max-h-[480px] divide-y divide-neutral-100 overflow-y-auto">
              {keywords.map((k) => (
                <li key={k.keyword} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-3 md:grid-cols-[1fr_90px_90px_80px_80px_110px]">
                  <span className="font-semibold text-neutral-900">{k.keyword}</span>
                  <span className="col-span-2 flex gap-3 text-xs text-neutral-500 md:contents md:text-sm md:text-neutral-700">
                    <span className="md:text-right"><span className="md:hidden">검색 </span>{fmt(k.monthlySearch)}</span>
                    <span className="md:text-right"><span className="md:hidden">문서 </span>{fmt(k.documents)}</span>
                    <span className="md:text-right"><span className="md:hidden">비율 </span>{k.ratio === null ? "-" : k.ratio < 10 ? k.ratio.toFixed(1) : Math.round(k.ratio)}</span>
                  </span>
                  <span className={`row-start-1 col-start-2 justify-self-end rounded-full px-2.5 py-0.5 text-xs font-bold md:row-auto md:col-auto md:justify-self-center ${GRADE_STYLE[k.grade]}`}>{k.grade}</span>
                  <button
                    type="button"
                    onClick={() => analyze(k.keyword)}
                    disabled={busy}
                    className="col-span-2 rounded-full bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 active:scale-95 disabled:opacity-50 md:col-span-1"
                  >
                    {loading === "analyze" && analyzing === k.keyword ? "분석 중…" : "상위 글 분석"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form
          className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-4 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (direct.trim()) analyze(direct.trim());
          }}
        >
          <input value={direct} onChange={(e) => setDirect(e.target.value)} placeholder="정해 둔 키워드가 있으면 바로 분석 (예: 인스타그램 해시태그)" aria-label="바로 분석할 키워드" className={INPUT} />
          <button type="submit" disabled={!direct.trim() || busy} className={`${BTN} shrink-0 bg-brand-700 py-3 text-white hover:bg-brand-800`}>
            {loading === "analyze" && analyzing === direct.trim() && <Spinner />}바로 분석
          </button>
        </form>
      </section>

      {loading === "analyze" && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-brand-50 p-5 text-sm font-semibold text-brand-800" aria-live="polite">
          <Spinner />&ldquo;{analyzing}&rdquo; 네이버 블로그 1~5위 글을 열어 분석하고 있어요 (10~20초)
        </div>
      )}

      {message && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
          {message}
        </p>
      )}

      {/* 2. 분석 결과 */}
      {analysis && (
        <section id="analysis" className="mt-8 scroll-mt-6">
          <StepTitle n={2} title={`"${analysis.keyword}" 상위 1~5위 공통점`} desc="이 숫자에 맞춰 쓰면 상위 글과 비슷한 수준이 돼요. 아래 지시문에 자동으로 반영돼 있어요." />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="제목 길이" value={`${analysis.summary.titleLength}자`} sub={`키워드로 시작 ${analysis.summary.titleStartsWithKeyword}/5`} />
            <Stat label="본문 글자 수" value={`${analysis.summary.chars.toLocaleString()}자`} sub="공백 제외" />
            <Stat label="사진" value={`${analysis.summary.images}장`} sub={`인용구 ${analysis.summary.quotes}개`} />
            <Stat label="키워드 반복" value={`${analysis.summary.keywordExact}회`} sub={`도입부에 키워드 ${analysis.summary.keywordInIntro}/5`} />
            <Stat label="태그" value={`${analysis.summary.tags}개`} />
            <Stat label="공감 · 댓글" value={`${analysis.summary.likes} · ${analysis.summary.comments}`} sub="중간값" />
            <Stat label="최신성" value={`${analysis.summary.freshDays}일 전`} sub="상위 글이 올라온 시점" />
            <Stat label="광고 · 의심 글" value={`${analysis.summary.adPosts} · ${analysis.summary.suspiciousPosts}`} sub="5개 중" warn={analysis.summary.adPosts + analysis.summary.suspiciousPosts > 0} />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Chips title="서브 키워드 (상위 글 공통)" items={analysis.subKeywords} />
            <Chips title="많이 쓴 태그" items={analysis.popularTags.map((t) => `#${t}`)} />
            <Chips title="제목 패턴" items={analysis.titlePatterns} />
          </div>

          <ul className="mt-4 grid gap-3">
            {analysis.posts.map((p) => (
              <li key={p.url} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-950 text-sm font-bold text-accent-gold">{p.rank}</span>
                  <div className="min-w-0 flex-1">
                    <a href={p.url} target="_blank" rel="noreferrer" className="font-bold text-neutral-900 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
                      {p.title || "(제목 없음)"}
                    </a>
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-500">
                      <span>{ago(p.publishedAt)}</span>
                      <span>글자 {p.chars.toLocaleString()}</span>
                      <span>사진 {p.images}</span>
                      <span>인용구 {p.quotes}</span>
                      <span>키워드 {p.keywordExact}회</span>
                      <span>태그 {p.tags.length}</span>
                      <span>공감 {p.likes ?? "-"}</span>
                      <span>댓글 {p.comments ?? "-"}</span>
                      {p.postsPerDay !== null && <span>블로그 하루 글 {p.postsPerDay}개</span>}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <Verdict label="광고 여부" badge={p.ad.verdict} style={AD_STYLE[p.ad.verdict]} reasons={p.ad.reasons} empty="광고 표기나 제휴 링크가 없어요" />
                  <Verdict
                    label="트래픽 작업 의심"
                    badge={p.traffic.level}
                    style={TRAFFIC_STYLE[p.traffic.level]}
                    reasons={p.traffic.reasons}
                    empty="특별한 의심 신호가 없어요"
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-neutral-400">
            광고·트래픽 판정은 공개된 정보로 본 &ldquo;의심 신호&rdquo;예요. 확정이 아니니 참고용으로만 봐 주세요. 스크랩 수는 네이버가 공개하지 않아 볼 수 없어요.
          </p>
        </section>
      )}

      {/* 3. 글쓰기 지시문 */}
      {prompt && (
        <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <StepTitle n={3} title="상위노출용 글쓰기 지시문" desc="복사해서 Claude나 ChatGPT에 붙여 넣으면, 분석 결과에 맞춘 글과 사진 위치가 나와요." />
            <button type="button" onClick={copyPrompt} className={`${BTN} shrink-0 bg-brand-700 text-white hover:bg-brand-800`}>
              {copied ? "복사됨 ✓" : "지시문 복사"}
            </button>
          </div>
          <textarea readOnly value={prompt} rows={16} aria-label="글쓰기 지시문" className={`${INPUT} mt-4 font-mono text-[13px] leading-relaxed`} onFocus={(e) => e.currentTarget.select()} />
          <ol className="mt-4 grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
            {[
              "지시문을 복사해서 Claude 또는 ChatGPT에 붙여 넣어요",
              "[사진 N] 자리에 직접 찍은 사진·화면 캡처를 넣어요",
              "[직접 경험] 자리는 꼭 대표님의 실제 경험으로 채워요",
              "제목 후보 중 하나를 고르고 태그까지 넣어 발행해요",
            ].map((t, i) => (
              <li key={t} className="flex gap-2 rounded-xl bg-neutral-50 px-3 py-2.5 ring-1 ring-neutral-100">
                <span className="font-bold text-brand-700">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </section>
      )}
    </AdminShell>
  );
}

function StepTitle({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-950 text-sm font-bold text-accent-gold">{n}</span>
      <div>
        <h2 className="font-bold text-neutral-900">{title}</h2>
        <p className="mt-0.5 text-sm leading-relaxed text-neutral-500">{desc}</p>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, warn }: { label: string; value: string; sub?: string; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <p className={`mt-1 text-xl font-extrabold ${warn ? "text-red-600" : "text-neutral-900"}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-neutral-400">{sub}</p>}
    </div>
  );
}

function Chips({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-neutral-500">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.length ? (
          items.map((t) => (
            <span key={t} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800 ring-1 ring-brand-100">
              {t}
            </span>
          ))
        ) : (
          <span className="text-xs text-neutral-400">없음</span>
        )}
      </div>
    </div>
  );
}

function Verdict({ label, badge, style, reasons, empty }: { label: string; badge: string; style: string; reasons: string[]; empty: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 px-3 py-2.5 ring-1 ring-neutral-100">
      <p className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        {label}
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${style}`}>{badge}</span>
      </p>
      <ul className="mt-1.5 space-y-0.5 text-xs leading-relaxed text-neutral-600">
        {reasons.length ? reasons.map((r) => <li key={r}>· {r}</li>) : <li>· {empty}</li>}
      </ul>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
