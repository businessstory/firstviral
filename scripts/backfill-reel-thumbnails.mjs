// 이미 저장된 릴스 중 썸네일이 인스타그램 CDN(만료되는 주소)인 것을 Supabase Storage 영구 주소로 옮긴다.
// 사용: node --env-file=.env.local scripts/backfill-reel-thumbnails.mjs
const SUPABASE_URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "reel-thumbnails";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const rows = await (await fetch(`${SUPABASE_URL}/rest/v1/trending_reels?select=id,post_url,thumbnail_url&limit=2000`, { headers: H })).json();
const todo = rows.filter((r) => !r.thumbnail_url?.startsWith(`${SUPABASE_URL}/storage/`));
console.log(`전체 ${rows.length}개 중 옮길 썸네일 ${todo.length}개`);

let ok = 0, fail = 0;
for (const r of todo) {
  const code = r.post_url.match(/instagram\.com\/(?:p|reel|reels)\/([^/?#]+)/)?.[1];
  let img = null;
  for (const url of [code && `https://www.instagram.com/p/${code}/media/?size=m`, r.thumbnail_url].filter(Boolean)) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      const type = res.headers.get("content-type") ?? "";
      if (res.ok && type.startsWith("image/")) { img = { body: await res.arrayBuffer(), type }; break; }
    } catch {}
  }
  if (!img || !code) { fail++; await sleep(800); continue; }
  const ext = img.type.includes("png") ? "png" : img.type.includes("webp") ? "webp" : "jpg";
  const up = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${code}.${ext}`, {
    method: "POST",
    headers: { ...H, "Content-Type": img.type, "x-upsert": "true", "cache-control": "max-age=31536000" },
    body: img.body,
  });
  if (!up.ok) { fail++; continue; }
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${code}.${ext}`;
  await fetch(`${SUPABASE_URL}/rest/v1/trending_reels?id=eq.${r.id}`, {
    method: "PATCH",
    headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ thumbnail_url: publicUrl }),
  });
  ok++;
  if ((ok + fail) % 25 === 0) console.log(`진행 ${ok + fail}/${todo.length} (성공 ${ok}, 실패 ${fail})`);
  await sleep(800);
}
console.log(`완료: 성공 ${ok}, 실패 ${fail}`);
