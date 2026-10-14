// 인스타그램 썸네일 주소(CDN)는 서명이 붙어 있어 며칠 뒤 만료된다(403).
// 그래서 수집할 때 작은 썸네일을 받아 Supabase Storage(공개 버킷)에 복사하고, 영구 주소를 저장한다.
const BUCKET = "reel-thumbnails";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

export function reelShortCode(postUrl: string): string | null {
  return postUrl.match(/instagram\.com\/(?:p|reel|reels)\/([^/?#]+)/)?.[1] ?? null;
}

export function isStoredThumbnail(url: string | null, supabaseUrl: string): boolean {
  return !!url && url.startsWith(`${supabaseUrl}/storage/v1/object/public/${BUCKET}/`);
}

async function download(url: string): Promise<{ body: ArrayBuffer; type: string } | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/")) return null;
    return { body: await res.arrayBuffer(), type };
  } catch {
    return null;
  }
}

// 성공하면 영구 공개 주소, 실패하면 null
export async function storeReelThumbnail(
  postUrl: string,
  cdnUrl: string | null,
  supabaseUrl: string,
  serviceKey: string
): Promise<string | null> {
  const code = reelShortCode(postUrl);
  if (!code) return null;
  // 320px 크기(약 20KB)를 우선 받고, 안 되면 수집 당시 받은 원본 주소로 시도
  const img = (await download(`https://www.instagram.com/p/${code}/media/?size=m`)) ?? (cdnUrl ? await download(cdnUrl) : null);
  if (!img) return null;

  const ext = img.type.includes("png") ? "png" : img.type.includes("webp") ? "webp" : "jpg";
  const path = `${code}.${ext}`;
  const res = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": img.type,
      "x-upsert": "true",
      "cache-control": "max-age=31536000",
    },
    body: img.body,
  });
  if (!res.ok) return null;
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;
}
