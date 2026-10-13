"use client";

import { useEffect, useMemo, useState } from "react";
import type { KeywordReport, VideoRow } from "@/lib/youtubeKeywords";
import AdminShell from "./AdminShell";

const MAX_PER_RUN = 10;
const UNITS_PER_KEYWORD = 102;
const DAILY_UNITS = 10_000;
const USAGE_KEY = "kw-usage";

const BTN =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";

const VERDICT: Record<KeywordReport["verdict"], { badge: string; ring: string; hint: string }> = {
  황금: { badge: "bg-accent-gold text-brand-950", ring: "#d9a92b", hint: "검색은 많고 상위 영상은 약해요. 지금 바로 만들 만해요." },
  괜찮음: { badge: "bg-brand-100 text-brand-800", ring: "#2f8f5b", hint: "해볼 만해요. 제목·썸네일로 차별화하면 승산이 있어요." },
  레드오션: { badge: "bg-red-100 text-red-700", ring: "#e05252", hint: "큰 채널이 꽉 잡고 있어요. 키워드를 더 좁혀 보세요." },
  "수요 적음": { badge: "bg-neutral-200 text-neutral-600", ring: "#a3a3a3", hint: "찾는 사람이 적어요. 더 넓은 키워드를 찾아보세요." },
};

const fmt = (n: number) =>
  n >= 100_000_000 ? `${(n / 100_000_000).toFixed(1)}억` : n >= 10_000 ? `${(n / 10_000).toFixed(n >= 100_000 ? 0 : 1)}만` : n.toLocaleString("ko-KR");
const fmtAge = (d: number) => (d >= 365 ? `${(d / 365).toFixed(1)}년` : d >= 30 ? `${Math.round(d / 30)}개월` : `${d}일`);

// YouTube API 제목은 &#39; 같은 HTML 엔티티로 오므로 글자로 되돌린다 (HTML로 넣지 않음)
const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };
const decodeEntities = (t: string) => t.replace(/&(amp|lt|gt|quot|#39);/g, (m) => ENTITIES[m] ?? m);

// 구독자 대비 조회수가 높은 영상 = "작은 채널도 터진" 기회 신호
const isOpportunity = (v: VideoRow) => v.subscribers !== null && v.subscribers < 10_000 && v.views >= 10_000;

// 무료 사용량은 매일 오후 4시(한국 시간, 태평양 자정)에 초기화돼요
function quotaDay() {
  return new Date(Date.now() - 8 * 3_600_000).toISOString().slice(0, 10);
}
function readUsage(): number {
  try {
    const raw = JSON.parse(localStorage.getItem(USAGE_KEY) ?? "null");
    return raw?.day === quotaDay() ? Number(raw.units) || 0 : 0;
  } catch {
    return 0;
  }
}
function addUsage(units: number) {
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify({ day: quotaDay(), units: readUsage() + units }));
  } catch {
    // 저장이 막힌 브라우저에서는 사용량 표시만 생략
  }
}

export default function KeywordResearchAdmin({ configured }: { configured: boolean }) {
  const [seed, setSeed] = useState("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [manual, setManual] = useState("");
  const [reports, setReports] = useState<KeywordReport[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [expanding, setExpanding] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number; current: string } | null>(null);
  const [message, setMessage] = useState("");
  const [usage, setUsage] = useState(0);
  const [sort, setSort] = useState<"score" | "views">("score");

  useEffect(() => setUsage(readUsage()), []);

  const queue = useMemo(() => {
    const manualList = manual.split("\n").map((s) => s.trim()).filter(Boolean);
    return [...new Set([...selected, ...manualList])];
  }, [selected, manual]);
  const runList = queue.slice(0, MAX_PER_RUN);
  const remaining = Math.max(0, DAILY_UNITS - usage);
  const sorted = useMemo(
    () => [...reports].sort((a, b) => (sort === "score" ? b.score - a.score : b.medianViews - a.medianViews)),
    [reports, sort],
  );
  const busy = expanding || progress !== null;

  async function expand() {
    const q = seed.trim();
    if (!q) return;
    setExpanding(true);
    setMessage("");
    try {
      const res = await fetch(`/api/keyword-research?seed=${encodeURIComponent(q)}`);
      const data = await res.json();
      const list: string[] = data.keywords ?? [];
      setCandidates(list);
      setSelected([]);
      if (!list.length) setMessage("자동완성 결과가 없어요. 조금 더 짧거나 다른 단어로 검색해 보세요.");
    } catch {
      setMessage("자동완성을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
    setExpanding(false);
  }

  function toggle(kw: string) {
    setSelected((s) => (s.includes(kw) ? s.filter((k) => k !== kw) : s.length >= MAX_PER_RUN ? s : [...s, kw]));
  }

  async function analyze() {
    if (!runList.length) return;
    if (runList.length * UNITS_PER_KEYWORD > remaining) {
      setMessage(`오늘 남은 무료 사용량으로는 ${Math.floor(remaining / UNITS_PER_KEYWORD)}개까지만 분석할 수 있어요.`);
      return;
    }
    setMessage("");
    const failed: string[] = [];
    // 하나씩 요청해서 진행 상황을 보여주고, 끝난 결과부터 바로 표시
    for (let i = 0; i < runList.length; i++) {
      const kw = runList[i];
      setProgress({ done: i, total: runList.length, current: kw });
      try {
        const res = await fetch("/api/keyword-research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keywords: [kw] }),
        });
        const data = await res.json();
        if (data.error === "not_configured") {
          setMessage("YouTube API 키가 아직 연결되지 않았어요.");
          break;
        }
        if (data.error === "quota_or_key") {
          setMessage("오늘 무료 사용량을 다 썼거나 API 키에 문제가 있어요. 오후 4시(한국 시간) 이후 다시 시도해 주세요.");
          break;
        }
        addUsage(UNITS_PER_KEYWORD);
        setUsage(readUsage());
        const report: KeywordReport | undefined = data.reports?.[0];
        if (report) setReports((prev) => [report, ...prev.filter((r) => r.keyword !== report.keyword)]);
        else failed.push(kw);
      } catch {
        failed.push(kw);
      }
    }
    setProgress(null);
    setSelected((s) => s.filter((k) => !runList.includes(k)));
    if (failed.length) setMessage(`분석하지 못한 키워드: ${failed.join(", ")}`);
  }

  return (
    <AdminShell title="황금 키워드 찾기">
      {/* 소개 + 사용량 */}
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="rounded-2xl bg-brand-950 p-6 text-white shadow-[0_12px_30px_rgba(11,43,33,0.18)]">
          <p className="text-lg font-bold">검색은 많은데, 볼 만한 영상은 적은 키워드</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-100/80">
            유튜브 자동완성으로 사람들이 실제 검색하는 말을 모으고,
            <br className="hidden sm:block" /> 검색 상위 영상의 조회수·채널 크기·업로드 날짜로 기회 점수를 매겨요.
          </p>
          <ol className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            {["주제 입력", "키워드 고르기", "점수 확인", "황금 키워드로 영상 제작"].map((s, i) => (
              <li key={s} className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
                <span className="mr-1 text-accent-gold">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-neutral-500">오늘 남은 무료 분석</p>
          <p className="mt-1 text-3xl font-extrabold text-brand-800">
            {Math.floor(remaining / UNITS_PER_KEYWORD)}
            <span className="ml-1 text-base font-bold text-neutral-400">/ {Math.floor(DAILY_UNITS / UNITS_PER_KEYWORD)}개</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${(remaining / DAILY_UNITS) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            매일 오후 4시에 다시 채워져요. 다 써도 요금은 나가지 않고 그날만 멈춰요.
          </p>
        </div>
      </div>

      {!configured && (
        <div className="mt-4 rounded-2xl border border-accent-gold/60 bg-accent-gold/10 p-5 text-sm leading-relaxed text-neutral-700">
          <p className="font-bold text-neutral-900">YouTube API 키를 연결해야 점수를 매길 수 있어요.</p>
          <p className="mt-1">자동완성으로 키워드 모으기는 키 없이도 바로 쓸 수 있어요.</p>
        </div>
      )}

      {/* 1. 키워드 모으기 */}
      <section className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
        <StepTitle n={1} title="후보 키워드 모으기" desc="주제를 넣으면 유튜브 자동완성(사람들이 실제로 검색하는 말)을 모아 와요." />
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            expand();
          }}
        >
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="예: 챗gpt 무료, 인스타 릴스, 부업"
              aria-label="주제 키워드"
              className="w-full rounded-xl border border-neutral-300 py-3 pl-11 pr-4 text-[15px] outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <button type="submit" disabled={!seed.trim() || busy} className={`${BTN} bg-brand-700 py-3 text-white hover:bg-brand-800`}>
            {expanding ? <Spinner /> : null}
            {expanding ? "모으는 중…" : "자동완성 모으기"}
          </button>
        </form>

        {candidates.length > 0 && (
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-neutral-500">
                {candidates.length}개를 찾았어요 · 분석할 키워드를 골라 주세요{" "}
                <b className="text-brand-700">
                  ({selected.length}/{MAX_PER_RUN})
                </b>
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelected(candidates.slice(0, MAX_PER_RUN))}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 active:scale-95"
                >
                  위에서 10개 선택
                </button>
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  disabled={!selected.length}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-neutral-500 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 active:scale-95 disabled:opacity-40"
                >
                  선택 해제
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {candidates.map((kw) => {
                const on = selected.includes(kw);
                const full = !on && selected.length >= MAX_PER_RUN;
                return (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => toggle(kw)}
                    disabled={full}
                    aria-pressed={on}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm ring-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                      on ? "bg-brand-700 font-semibold text-white ring-brand-700" : "bg-white text-neutral-700 ring-neutral-300 hover:bg-brand-50 hover:ring-brand-200"
                    }`}
                  >
                    {on && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden>
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    )}
                    {kw}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 2. 분석 */}
      <section className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
        <StepTitle n={2} title="황금 키워드 점수 매기기" desc="직접 넣고 싶은 키워드가 있으면 한 줄에 하나씩 적어 주세요. 위에서 고른 키워드와 함께 분석해요." />
        <textarea
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          rows={3}
          placeholder={"챗gpt 회의록 정리\n챗gpt 엑셀 수식"}
          aria-label="직접 입력할 키워드"
          className="mt-4 w-full rounded-xl border border-neutral-300 px-4 py-3 text-[15px] outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />

        {progress ? (
          <div className="mt-4 rounded-xl bg-brand-50 p-4" aria-live="polite">
            <div className="flex items-center justify-between text-sm">
              <span className="flex min-w-0 items-center gap-2 font-semibold text-brand-800">
                <Spinner />
                <span className="truncate">&ldquo;{progress.current}&rdquo; 분석 중</span>
              </span>
              <span className="shrink-0 font-bold text-brand-700">
                {progress.done + 1}/{progress.total}
              </span>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-brand-600 transition-[width] duration-500" style={{ width: `${((progress.done + 0.5) / progress.total) * 100}%` }} />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">
              {runList.length ? (
                <>
                  <b className="text-neutral-800">{runList.length}개</b> 분석 · 무료 분석 {runList.length}개 사용
                  {queue.length > MAX_PER_RUN && <span className="text-red-500"> (한 번에 {MAX_PER_RUN}개까지, 앞에서부터 분석해요)</span>}
                </>
              ) : (
                "1단계에서 키워드를 고르거나 직접 적어 주세요."
              )}
            </p>
            <button
              type="button"
              onClick={analyze}
              disabled={!configured || !runList.length || busy}
              className={`${BTN} bg-accent-gold px-6 py-3 text-brand-950 shadow-[0_8px_20px_rgba(232,196,104,0.35)] hover:bg-[#f0d07c]`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" />
              </svg>
              점수 매기기
            </button>
          </div>
        )}
      </section>

      {message && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
          {message}
        </p>
      )}

      {/* 3. 결과 */}
      {reports.length > 0 && (
        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900">분석 결과 {reports.length}개</h2>
              <p className="mt-0.5 text-sm text-neutral-500">카드를 누르면 검색 상위 영상을 볼 수 있어요.</p>
            </div>
            <div className="flex rounded-full bg-neutral-100 p-1 text-sm font-semibold" role="group" aria-label="정렬">
              {(
                [
                  ["score", "점수순"],
                  ["views", "조회수순"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSort(k)}
                  aria-pressed={sort === k}
                  className={`rounded-full px-4 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                    sort === k ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-4 grid gap-3">
            {sorted.map((r) => (
              <ReportCard key={r.keyword} r={r} open={open === r.keyword} onToggle={() => setOpen(open === r.keyword ? null : r.keyword)} />
            ))}
          </ul>
        </section>
      )}

      {reports.length === 0 && !progress && (
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 px-5 py-12 text-center">
          <p className="font-semibold text-neutral-700">아직 분석한 키워드가 없어요</p>
          <p className="mt-1 text-sm text-neutral-500">위에서 주제를 넣고 키워드를 골라 점수를 매겨 보세요.</p>
        </div>
      )}

      <details className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 text-sm leading-relaxed text-neutral-600 shadow-sm">
        <summary className="cursor-pointer font-bold text-neutral-900">점수는 이렇게 매겨요</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>
            <b>수요 (40점)</b>: 상위 10개 영상의 중간 조회수. 100만 회면 만점
          </li>
          <li>
            <b>작은 채널 성공 (30점)</b>: 구독자 1만 명 미만인데 조회수 1만 회 이상인 영상 수. 5개 이상이면 만점
          </li>
          <li>
            <b>상위 영상 나이 (15점)</b>: 상위 영상이 오래될수록 새 영상이 들어갈 자리가 있어요. 2년 이상이면 만점
          </li>
          <li>
            <b>대형 채널이 적음 (15점)</b>: 구독자 100만 명 이상 채널이 적을수록 높아요
          </li>
          <li>
            70점 이상 <b>황금</b>, 50~69점 <b>괜찮음</b>, 그 아래는 <b>레드오션</b>. 중간 조회수가 3천 회 미만이면 <b>수요 적음</b>
          </li>
        </ul>
      </details>
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

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const c = 2 * Math.PI * 26;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r="26" fill="none" stroke="#eef0ee" strokeWidth="7" />
        <circle cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-neutral-900">{score}</span>
    </div>
  );
}

function Metric({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div className="rounded-xl bg-neutral-50 px-3 py-2.5 ring-1 ring-neutral-100">
      <p className="text-[11px] font-semibold text-neutral-500">{label}</p>
      <p className={`mt-0.5 text-[15px] font-bold ${good ? "text-brand-700" : "text-neutral-800"}`}>{value}</p>
    </div>
  );
}

function ReportCard({ r, open, onToggle }: { r: KeywordReport; open: boolean; onToggle: () => void }) {
  const v = VERDICT[r.verdict];
  return (
    <li className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${r.verdict === "황금" ? "border-accent-gold" : "border-neutral-200"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-col gap-4 p-4 text-left focus:outline-none focus-visible:bg-brand-50 md:flex-row md:items-center md:p-5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <ScoreRing score={r.score} color={v.ring} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[17px] font-extrabold text-neutral-900">{r.keyword}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${v.badge}`}>{r.verdict}</span>
            </div>
            <p className="mt-1 text-sm text-neutral-500">{v.hint}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:w-[440px] md:shrink-0">
          <Metric label="중간 조회수" value={fmt(r.medianViews)} good={r.medianViews >= 30_000} />
          <Metric label="작은 채널 성공" value={`${r.smallChannelWins}/10개`} good={r.smallChannelWins >= 2} />
          <Metric label="상위 영상 나이" value={fmtAge(r.medianAgeDays)} good={r.medianAgeDays >= 365} />
          <Metric label="대형 채널" value={`${Math.round(r.bigChannelShare * 100)}%`} good={r.bigChannelShare <= 0.2} />
        </div>
        <svg className={`hidden shrink-0 text-neutral-400 transition-transform md:block ${open ? "rotate-180" : ""}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-neutral-100 bg-neutral-50/70 px-4 py-4 md:px-5">
          <p className="text-xs font-semibold text-neutral-500">
            검색 상위 영상 · <span className="text-accent-gold">★</span> 표시는 작은 채널(구독자 1만 미만)인데 조회수 1만 회 이상 나온 영상이에요
          </p>
          <ol className="mt-3 space-y-2">
            {r.videos.slice(0, 10).map((video, i) => (
              <li key={video.id}>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 ring-1 transition-colors hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                    isOpportunity(video) ? "ring-accent-gold" : "ring-neutral-200"
                  }`}
                >
                  <span className="w-5 shrink-0 text-center text-sm font-bold text-neutral-400">{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`} alt="" className="hidden h-12 w-[84px] shrink-0 rounded-md object-cover sm:block" loading="lazy" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-neutral-800">
                      {isOpportunity(video) && <span className="mr-1 text-accent-gold">★</span>}
                      {decodeEntities(video.title)}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-neutral-500">
                      {decodeEntities(video.channel)} · 구독자 {video.subscribers === null ? "비공개" : fmt(video.subscribers)} · {fmtAge(video.ageDays)} 전
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold text-neutral-900">{fmt(video.views)}</span>
                    <span className="block text-[11px] text-neutral-400">조회수</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </li>
  );
}
