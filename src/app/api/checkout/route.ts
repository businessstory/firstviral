import { NextRequest, NextResponse } from "next/server";
import { createPaymentLink } from "@/lib/payssam";

export async function POST(req: NextRequest) {
  const { productName, amountKrw } = await req.json();

  if (!productName || !amountKrw) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const url = await createPaymentLink(productName, amountKrw);
  if (!url) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  return NextResponse.json({ url });
}
