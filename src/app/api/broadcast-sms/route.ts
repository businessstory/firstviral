import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// 알리고는 한 번 요청에 최대 1000명까지 받을 수 있어서, 안전하게 900명 단위로 나눠 보냅니다.
const CHUNK_SIZE = 900;

function normalizePhone(input: string): string {
  return input.replace(/[^0-9]/g, "");
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

// 알리고가 고정 IP만 허용해서, Vercel(고정 IP 없음) 대신
// 고정 IP를 가진 중계 서버(오라클 클라우드)를 거쳐서 보냅니다.
async function sendChunk(
  receivers: string[],
  message: string,
  proxyUrl: string,
  proxySecret: string
): Promise<{ ok: boolean; successCnt: number; errorCnt: number; raw: unknown }> {
  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Secret": proxySecret,
    },
    body: JSON.stringify({
      receiver: receivers.join(","),
      msg: message,
    }),
  });

  const data = await res.json();
  const successCnt = Number(data?.success_cnt ?? 0);
  const errorCnt = Number(data?.error_cnt ?? receivers.length);
  const ok = res.ok && String(data?.result_code) === "1";

  return { ok, successCnt, errorCnt, raw: data };
}

export async function POST(req: NextRequest) {
  const { phones, message } = await req.json();

  if (!Array.isArray(phones) || phones.length === 0) {
    return NextResponse.json({ error: "invalid_phones" }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length < 1) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  const proxyUrl = process.env.SMS_PROXY_URL;
  const proxySecret = process.env.SMS_PROXY_SECRET;
  const senderNumber = process.env.SMS_SENDER_NUMBER;
  if (!proxyUrl || !proxySecret || !senderNumber) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const receivers = Array.from(
    new Set(
      (phones as string[])
        .map(normalizePhone)
        .filter((p) => p.length >= 9)
    )
  );
  if (receivers.length === 0) {
    return NextResponse.json({ error: "no_valid_phones" }, { status: 400 });
  }

  // 광고성 메시지 법정 표기: "(광고)" 접두어 + 수신거부 안내 (정보통신망법 제50조)
  const senderDisplay = senderNumber.replace(/[^0-9]/g, "").replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  const fullMessage = `(광고)${message.trim()}\n\n무료거부 ${senderDisplay}`;

  const chunks = chunk(receivers, CHUNK_SIZE);
  const outcomes = await Promise.allSettled(
    chunks.map((c) => sendChunk(c, fullMessage, proxyUrl, proxySecret))
  );

  let sent = 0;
  let failed = 0;
  const errors: unknown[] = [];
  for (const outcome of outcomes) {
    if (outcome.status === "fulfilled") {
      sent += outcome.value.successCnt;
      failed += outcome.value.errorCnt;
      if (!outcome.value.ok) errors.push(outcome.value.raw);
    } else {
      failed += CHUNK_SIZE;
      errors.push(String(outcome.reason));
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    failed,
    total: receivers.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
