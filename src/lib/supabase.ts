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
