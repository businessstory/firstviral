import { NextRequest, NextResponse } from "next/server";
import { analyzeKeyword, expandKeywords } from "@/lib/youtubeKeywords";

const MAX_PER_REQUEST = 10;

// GET ?seed=챗gpt 무료 → 자동완성으로 후보 키워드 목록 (API 키·쿼터 필요 없음)
export async function GET(req: NextRequest) {
  const seed = req.nextUrl.searchParams.get("seed")?.trim();
  if (!seed) return NextResponse.json({ error: "invalid_seed" }, { status: 400 });
  const keywords = await expandKeywords(seed);
  return NextResponse.json({ keywords });
}

// POST { keywords: string[] } → 키워드별 황금 키워드 점수 (YouTube Data API 사용)
export async function POST(req: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not_configured" }, { status: 501 });

  const { keywords } = await req.json();
  if (!Array.isArray(keywords) || keywords.length === 0) {
    return NextResponse.json({ error: "invalid_keywords" }, { status: 400 });
  }
  const list = [...new Set(keywords.map((k) => String(k).trim()).filter(Boolean))].slice(0, MAX_PER_REQUEST);

  const reports = [];
  const failed: string[] = [];
  for (const kw of list) {
    try {
      reports.push(await analyzeKeyword(kw, apiKey));
    } catch (e) {
      // 403 = 오늘 무료 쿼터 소진 또는 키 문제 → 나머지도 실패하므로 중단
      if (e instanceof Error && e.message.endsWith("_403")) {
        return NextResponse.json({ reports, failed: list.slice(reports.length), error: "quota_or_key" }, { status: 200 });
      }
      failed.push(kw);
    }
  }
  return NextResponse.json({ reports, failed });
}
