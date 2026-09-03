"use client";

// Supabase Auth(GoTrue) REST API를 SDK 없이 직접 호출. 세션은 localStorage에 저장.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SESSION_KEY = "fv_session";

export type Session = {
  access_token: string;
  email: string;
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("fv-auth-change"));
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("fv-auth-change"));
}

async function authRequest(path: string, body: object) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { ok: false as const, error: "인증 설정이 안 돼있어요." };
  }
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false as const, error: data?.msg || data?.error_description || "요청에 실패했어요." };
  }
  return { ok: true as const, data };
}

export async function signUp(email: string, password: string) {
  const result = await authRequest("/signup", { email, password });
  if (!result.ok) return result;
  // 이메일 확인이 꺼져있으면 access_token이 바로 옴 -> 자동 로그인
  if (result.data.access_token) {
    saveSession({ access_token: result.data.access_token, email });
  }
  return result;
}

export async function signIn(email: string, password: string) {
  const result = await authRequest("/token?grant_type=password", { email, password });
  if (!result.ok) return result;
  saveSession({ access_token: result.data.access_token, email });
  return result;
}
