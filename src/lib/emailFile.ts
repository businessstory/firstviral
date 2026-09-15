const PAGE_SIZE = 1000; // PostgREST가 요청 limit과 무관하게 한 번에 최대 1000행만 반환하므로 페이지네이션 필요

// 관리자가 엑셀 등으로 넘겨준 이메일 목록. Supabase 'imported_emails' 테이블에서 읽어옵니다.
// (로컬/배포 서버 어디서든 동일하게 동작하도록, 파일을 직접 읽는 대신 DB를 통해 공유합니다.)
export async function getExcelEmails(): Promise<string[]> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return [];

  const all: string[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const res = await fetch(
      `${url}/rest/v1/imported_emails?select=email&order=email.asc&offset=${offset}&limit=${PAGE_SIZE}`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) break;
    const rows = (await res.json()) as { email: string }[];
    all.push(...rows.map((r) => r.email));
    if (rows.length < PAGE_SIZE) break;
  }
  return all;
}
