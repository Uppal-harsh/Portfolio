import { NextResponse } from "next/server";
import { getCodolioPayload } from "@/lib/codolio";

export const revalidate = 900;
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCodolioPayload());
}
