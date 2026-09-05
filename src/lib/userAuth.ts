// 요청의 Authorization: Bearer <access_token> 이 실제 로그인한 사용자의 유효한
// Supabase 세션인지 확인합니다. 공개 API인데 완전 익명은 막고 싶을 때 씁니다.
export async function isValidUserToken(authHeader: string | null): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return false;

  const res = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
  });
  return res.ok;
}
