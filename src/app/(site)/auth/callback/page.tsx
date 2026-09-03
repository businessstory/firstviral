"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSession } from "@/lib/auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const errorDescription = hash.get("error_description");

      if (errorDescription) {
        setError(errorDescription);
        return;
      }
      if (!accessToken || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
        setError("로그인 정보를 받지 못했어요.");
        return;
      }

      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` },
      });
      const user = await res.json();

      if (!res.ok || !user?.email) {
        setError("사용자 정보를 가져오지 못했어요.");
        return;
      }

      saveSession({ access_token: accessToken, email: user.email });
      router.replace("/");
    }
    run();
  }, [router]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-5 text-center">
      {error ? (
        <>
          <p className="text-sm font-semibold text-rose-500">로그인 실패</p>
          <p className="mt-2 text-sm text-neutral-500">{error}</p>
        </>
      ) : (
        <p className="text-sm text-neutral-500">로그인 처리 중...</p>
      )}
    </section>
  );
}
