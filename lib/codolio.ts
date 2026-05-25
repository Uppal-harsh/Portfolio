import { CodolioPayload } from "./types";

const USERNAME = "uppal-harsh";
const profileUrl = `https://codolio.com/profile/${USERNAME}`;

function extractNumber(source: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match?.[1]) return Number(match[1].replace(/,/g, ""));
  }

  return undefined;
}

export async function getCodolioPayload(): Promise<CodolioPayload> {
  try {
    const response = await fetch(profileUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "uppal-harsh-portfolio"
      },
      next: { revalidate: 900 }
    });

    if (!response.ok) {
      throw new Error(`Codolio profile returned ${response.status}`);
    }

    const html = await response.text();
    const compact = html.replace(/\s+/g, " ");

    return {
      profileUrl,
      available: true,
      source: "codolio-profile-html",
      stats: {
        cScore: extractNumber(compact, [/C-?Score[^0-9]{0,60}([0-9,]+)/i, /"cScore"\s*:\s*([0-9,]+)/i]),
        totalQuestions: extractNumber(compact, [/Questions[^0-9]{0,60}([0-9,]+)/i, /"totalQuestions"\s*:\s*([0-9,]+)/i]),
        activeDays: extractNumber(compact, [/Active Days[^0-9]{0,60}([0-9,]+)/i, /"activeDays"\s*:\s*([0-9,]+)/i]),
        streak: extractNumber(compact, [/Streak[^0-9]{0,60}([0-9,]+)/i, /"streak"\s*:\s*([0-9,]+)/i]),
        contests: extractNumber(compact, [/Contests[^0-9]{0,60}([0-9,]+)/i, /"contests"\s*:\s*([0-9,]+)/i]),
        rank: extractNumber(compact, [/Rank[^0-9]{0,60}([0-9,]+)/i, /"rank"\s*:\s*([0-9,]+)/i])
      }
    };
  } catch (error) {
    return {
      profileUrl,
      available: false,
      source: "codolio-profile-link",
      stats: {},
      message: error instanceof Error ? error.message : "Codolio profile stats are unavailable."
    };
  }
}
