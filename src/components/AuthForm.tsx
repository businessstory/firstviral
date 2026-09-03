"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = mode === "login" ? await signIn(email, password) : await signUp(email, password);

    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (mode === "login") {
      router.push("/");
      router.refresh();
    } else if ((result.data as { access_token?: string }).access_token) {
      router.push("/");
      router.refresh();
    } else {
      // 이메일 확인이 켜져있는 경우: 바로 로그인은 안 되고 메일 확인이 필요함
      setSignedUp(true);
    }
  }

  if (signedUp) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-5 py-16 text-center">
        <h1 className="text-xl font-bold text-brand-950">가입 완료!</h1>
        <p className="mt-3 text-sm text-neutral-500">
          이메일로 온 확인 링크를 눌러야 로그인할 수 있어요. 메일함을 확인해주세요.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-700 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800"
        >
          로그인하러 가기
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-5 py-16">
      <h1 className="text-xl font-bold text-brand-950">{mode === "login" ? "로그인" : "회원가입"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
        />

        {error && <p className="text-xs text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-brand-700 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-neutral-500">
        {mode === "login" ? (
          <>
            아직 계정이 없으신가요?{" "}
            <Link href="/signup" className="font-semibold text-brand-700 underline underline-offset-2">
              회원가입
            </Link>
          </>
        ) : (
          <>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-semibold text-brand-700 underline underline-offset-2">
              로그인
            </Link>
          </>
        )}
      </p>
    </section>
  );
}
