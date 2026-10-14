import { NextRequest, NextResponse } from "next/server";
import { findGoldenKeywords, naverKeysStatus } from "@/lib/naver/keywords";

export const maxDuration = 60;

// POST { topic } → 황금 키워드 후보 (네이버 API 키가 있으면 검색량·문서 수 포함)
export async function POST(req: NextRequest) {
  const { topic } = await req.json();
  if (typeof topic !== "string" || !topic.trim()) return NextResponse.json({ error: "invalid_topic" }, { status: 400 });
  try {
    const result = await findGoldenKeywords(topic.trim());
    return NextResponse.json({ ...result, keys: naverKeysStatus() });
  } catch (e) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message, keys: naverKeysStatus() }, { status: 502 });
  }
}
