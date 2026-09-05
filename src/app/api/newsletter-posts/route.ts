import { NextRequest, NextResponse } from "next/server";
import { createNewsletterPost, updateNewsletterPost, deleteNewsletterPost } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { title, body, thumbnailUrl } = await req.json();

  if (typeof title !== "string" || title.trim().length < 1) {
    return NextResponse.json({ error: "invalid_title" }, { status: 400 });
  }
  if (typeof body !== "string" || body.trim().length < 1) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const result = await createNewsletterPost({
    title: title.trim(),
    body: body.trim(),
    thumbnailUrl: typeof thumbnailUrl === "string" && thumbnailUrl.trim() ? thumbnailUrl.trim() : null,
  });

  if (!result.ok) {
    const status = result.reason === "not_configured" ? 501 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const { id, title, body, thumbnailUrl } = await req.json();

  if (typeof id !== "string" || id.length < 1) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }
  if (typeof title !== "string" || title.trim().length < 1) {
    return NextResponse.json({ error: "invalid_title" }, { status: 400 });
  }
  if (typeof body !== "string" || body.trim().length < 1) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const result = await updateNewsletterPost(id, {
    title: title.trim(),
    body: body.trim(),
    thumbnailUrl: typeof thumbnailUrl === "string" && thumbnailUrl.trim() ? thumbnailUrl.trim() : null,
  });

  if (!result.ok) {
    const status = result.reason === "not_configured" ? 501 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (typeof id !== "string" || id.length < 1) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const result = await deleteNewsletterPost(id);
  if (!result.ok) {
    const status = result.reason === "not_configured" ? 501 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }
  return NextResponse.json({ ok: true });
}
