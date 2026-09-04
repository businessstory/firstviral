// Supabase REST API(PostgREST)로 직접 저장. SDK 설치 없이 fetch만으로 충분한 단순 insert.
export async function insertLead(params: {
  name: string;
  phone: string;
  email: string;
  leadMagnet: string;
}): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { ok: false, reason: "not_configured" };
  }

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: params.name,
      phone: params.phone,
      email: params.email,
      lead_magnet: params.leadMagnet,
    }),
  });

  if (!res.ok) {
    return { ok: false, reason: "request_failed" };
  }
  return { ok: true };
}

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  lead_magnet: string;
  status: "pending" | "done";
  created_at: string;
};

// 관리자 페이지 전용. service_role 키로 RLS를 우회해 전체 목록을 읽습니다.
// 이 함수는 서버 컴포넌트/라우트에서만 호출하고, 절대 클라이언트로 값을 내려보내지 마세요.
export async function getLeads(): Promise<Lead[]> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return [];

  const res = await fetch(`${url}/rest/v1/leads?select=*&order=created_at.desc`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

// 관리자 페이지에서 신청 상태(대기중/완료)를 변경할 때 사용. service_role 키로 RLS 우회.
export async function updateLeadStatus(
  id: string,
  status: "pending" | "done"
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return { ok: false, reason: "not_configured" };

  const res = await fetch(`${url}/rest/v1/leads?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true };
}

export type AuthUser = {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
};

// 관리자 페이지 전용. 회원가입(Supabase Auth)한 사용자 목록을 가져옵니다.
export async function getAuthUsers(): Promise<AuthUser[]> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return [];

  const res = await fetch(`${url}/auth/v1/admin/users?per_page=200`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return [];
  const data = await res.json();
  const users = (data.users ?? data) as {
    id: string;
    email: string;
    created_at: string;
    email_confirmed_at: string | null;
  }[];

  return users
    .map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      email_confirmed_at: u.email_confirmed_at,
    }))
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export type TrackedAccount = {
  id: string;
  category: string;
  username: string;
  follower_count: number | null;
  full_name: string | null;
  profile_pic_url: string | null;
  discovered_at: string;
};

// 관리자 페이지 전용. 카테고리별로 발굴해둔 팔로워 1만+ 계정 목록을 가져옵니다.
export async function getTrackedAccounts(): Promise<TrackedAccount[]> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return [];

  const res = await fetch(
    `${url}/rest/v1/tracked_accounts?select=*&order=category.asc,follower_count.desc`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return [];
  return res.json();
}
