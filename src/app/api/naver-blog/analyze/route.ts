import { NextRequest, NextResponse } from "next/server";
import { analyzeKeyword } from "@/lib/naver/analysis";
import { buildWritingPrompt } from "@/lib/naver/prompt";

export const maxDuration = 60;

// POST { keyword } → 블로그 탭 1~5위 글 분석 + 상위노출용 글쓰기 지시문
export async function POST(req: NextRequest) {
  const { keyword } = await req.json();
  if (typeof keyword !== "string" || !keyword.trim()) return NextResponse.json({ error: "invalid_keyword" }, { status: 400 });
  try {
    const analysis = await analyzeKeyword(keyword.trim());
    if (!analysis.posts.length) return NextResponse.json({ error: "no_posts" }, { status: 404 });
    return NextResponse.json({ analysis, prompt: buildWritingPrompt(analysis) });
  } catch {
    return NextResponse.json({ error: "naver_failed" }, { status: 502 });
  }
}
