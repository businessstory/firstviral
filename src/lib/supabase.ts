// Supabase REST API(PostgREST)로 직접 저장. SDK 설치 없이 fetch만으로 충분한 단순 insert.
export async function insertLead(params: {
  name: string;
  phone: string;
  email: string;
  leadMagnet: string;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
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
      agree_privacy: params.agreePrivacy,
      agree_marketing: params.agreeMarketing,
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
  agree_privacy: boolean;
  agree_marketing: boolean;
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

// 관리자 페이지에서 계정을 수동으로 추가할 때 사용. service_role 키로 RLS 우회.
export async function addTrackedAccount(params: {
  category: string;
  username: string;
}): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return { ok: false, reason: "not_configured" };

  const res = await fetch(`${url}/rest/v1/tracked_accounts?on_conflict=username`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ category: params.category, username: params.username }),
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true };
}

// 관리자 페이지에서 계정을 삭제할 때 사용. service_role 키로 RLS 우회.
export async function deleteTrackedAccount(
  id: string
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return { ok: false, reason: "not_configured" };

  const res = await fetch(`${url}/rest/v1/tracked_accounts?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=minimal",
    },
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true };
}

export type NewsletterPostRow = {
  id: string;
  title: string;
  body: string;
  thumbnail_url: string | null;
  published_at: string;
};

// 공개 목록 조회 (뉴스레터 페이지). anon 키로 조회, RLS에 공개 읽기 정책 있음.
export async function getNewsletterPosts(): Promise<NewsletterPostRow[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const res = await fetch(
    `${url}/rest/v1/newsletter_posts?select=*&order=published_at.desc`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getNewsletterPostById(id: string): Promise<NewsletterPostRow | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const res = await fetch(`${url}/rest/v1/newsletter_posts?id=eq.${id}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as NewsletterPostRow[];
  return rows[0] ?? null;
}

// 관리자 페이지에서 뉴스레터 작성 시 사용. service_role 키로 RLS 우회.
export async function createNewsletterPost(params: {
  title: string;
  body: string;
  thumbnailUrl: string | null;
}): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { ok: false, reason: "not_configured" };

  const res = await fetch(`${url}/rest/v1/newsletter_posts`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      title: params.title,
      body: params.body,
      thumbnail_url: params.thumbnailUrl,
    }),
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true };
}

export async function updateNewsletterPost(
  id: string,
  params: { title: string; body: string; thumbnailUrl: string | null }
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { ok: false, reason: "not_configured" };

  const res = await fetch(`${url}/rest/v1/newsletter_posts?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      title: params.title,
      body: params.body,
      thumbnail_url: params.thumbnailUrl,
    }),
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true };
}

export async function deleteNewsletterPost(
  id: string
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { ok: false, reason: "not_configured" };

  const res = await fetch(`${url}/rest/v1/newsletter_posts?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=minimal",
    },
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true };
}

// 관리자 페이지에서 이미지를 올릴 때 사용 (Supabase Storage). service_role 키로 업로드.
export async function uploadImage(
  file: File
): Promise<{ ok: true; url: string } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { ok: false, reason: "not_configured" };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const res = await fetch(`${url}/storage/v1/object/newsletter-images/${path}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: await file.arrayBuffer(),
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true, url: `${url}/storage/v1/object/public/newsletter-images/${path}` };
}

// 관리자 전체발송 대상 이메일 목록: 신청자(leads) + 회원가입(Auth) 이메일을 합쳐 중복 제거.
export async function getAllRecipientEmails(): Promise<string[]> {
  const [leads, users] = await Promise.all([getLeads(), getAuthUsers()]);
  const emails = new Set<string>();
  for (const l of leads) if (l.email) emails.add(l.email.toLowerCase());
  for (const u of users) if (u.email) emails.add(u.email.toLowerCase());
  return Array.from(emails);
}

// 관리자 페이지(DB 탭)에서 개인정보를 직접 추가할 때 사용. service_role 키로 RLS 우회.
export async function adminCreateLead(params: {
  name: string;
  phone: string;
  email: string;
  leadMagnet: string;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { ok: false, reason: "not_configured" };

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: params.name,
      phone: params.phone,
      email: params.email,
      lead_magnet: params.leadMagnet,
      agree_privacy: params.agreePrivacy,
      agree_marketing: params.agreeMarketing,
    }),
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true };
}

// 관리자 페이지(DB 탭)에서 개인정보를 삭제할 때 사용. service_role 키로 RLS 우회.
export async function deleteLead(
  id: string
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { ok: false, reason: "not_configured" };

  const res = await fetch(`${url}/rest/v1/leads?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=minimal",
    },
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true };
}

// "인스타그램 100만 뷰 공식 PDF" 전용 신청 폼 저장. anon 키로 insert.
export async function insertPdfApplication(params: {
  name: string;
  phone: string;
  reason: string;
  agreePrivacy: boolean;
}): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "request_failed" }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return { ok: false, reason: "not_configured" };

  const res = await fetch(`${url}/rest/v1/pdf_applications`, {
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
      reason: params.reason,
      agree_privacy: params.agreePrivacy,
    }),
  });

  if (!res.ok) return { ok: false, reason: "request_failed" };
  return { ok: true };
}

export type PdfApplication = {
  id: string;
  name: string;
  phone: string;
  reason: string;
  agree_privacy: boolean;
  created_at: string;
};

// 관리자 페이지 전용. service_role 키로 RLS 우회.
export async function getPdfApplications(): Promise<PdfApplication[]> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return [];

  const res = await fetch(`${url}/rest/v1/pdf_applications?select=*&order=created_at.desc`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}
