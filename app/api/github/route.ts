import { NextResponse } from "next/server";
import { getGitHubPayload } from "@/lib/github";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getGitHubPayload());
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load GitHub data.",
        generatedAt: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
