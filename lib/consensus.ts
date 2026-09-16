import Anthropic from "@anthropic-ai/sdk";
import { Consensus, ReviewSnippet } from "./types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are MovieLab's audience consensus summarizer.

You will receive a short list of real audience/critic review snippets for
one film, tagged by source. Synthesize them into a neutral, factual read
of what audiences actually think — do not inject your own opinion of the
film.

Output rules, enforced strictly:
- Respond with ONLY raw JSON. No markdown fences, no preamble, no
  trailing commentary.
- Plain sentence-case text throughout. No emojis, no asterisks, no
  ALL-CAPS, no bullet characters inside strings — the client renders
  these as its own bulleted list in Space Grotesk, so the string itself
  must just be a clean sentence fragment.
- "overall_consensus": exactly 2-3 sentences, describing the general
  shape of audience opinion (not a plot summary).
- "praises": exactly 2 strings, each one concise clause (max ~12 words),
  describing a specific thing reviewers liked.
- "critiques": exactly 2 strings, same length constraint, describing a
  specific recurring complaint. If reviews are overwhelmingly positive
  with no real complaint, name the mildest reservation reviewers raised
  rather than inventing one.

Match this exact JSON shape:
{
  "overall_consensus": string,
  "praises": [string, string],
  "critiques": [string, string]
}`;

export async function generateConsensus(
  movieTitle: string,
  reviews: ReviewSnippet[]
): Promise<Consensus> {
  const reviewBlock = reviews
    .map((r, i) => `[${i + 1}] (${r.source}) ${r.text}`)
    .join("\n\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Film: "${movieTitle}"\n\nReviews:\n${reviewBlock}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in consensus response");
  }

  const cleaned = textBlock.text.trim().replace(/^```json\s*|\s*```$/g, "");
  const parsed = JSON.parse(cleaned) as Consensus;

  // Defensive shape-check — never let a malformed model response reach the UI.
  if (
    typeof parsed.overall_consensus !== "string" ||
    !Array.isArray(parsed.praises) ||
    !Array.isArray(parsed.critiques)
  ) {
    throw new Error("Malformed consensus shape");
  }

  return parsed;
}
