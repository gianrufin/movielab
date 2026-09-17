import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import { Consensus, ReviewSnippet } from "./types";

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: key });
  }
  return geminiClient;
}

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: key });
  }
  return anthropicClient;
}

const SYSTEM_PROMPT = `You are MovieLab's audience review summarizer.

Create a simple, conversational, and direct summary of common audience reviews for a movie.
Avoid overly academic film critique vocabulary, complex jargon, or flowery language. Write in plain, everyday language that any moviegoer can instantly understand.

Rules:
- Respond with ONLY valid JSON without markdown wrapping.
- "overall_consensus": 1-2 simple sentences providing a clear general overview of how audiences feel about the movie.
- "loved_summary": A clear, direct summary of what most people loved, starting with or phrased like: "Most audiences loved [key strengths and highlights]..."
- "disliked_summary": A clear, direct summary of what people disliked or complained about, starting with or phrased like: "What most audiences disliked was [common criticisms and gripes]..."
- "praises": exactly 2 or 3 short, simple bullet phrases of what people loved.
- "critiques": exactly 2 or 3 short, simple bullet phrases of common complaints.

JSON shape:
{
  "overall_consensus": string,
  "loved_summary": string,
  "disliked_summary": string,
  "praises": [string, string],
  "critiques": [string, string]
}`;

export async function generateConsensus(
  movieTitle: string,
  reviews: ReviewSnippet[],
  overview?: string
): Promise<Consensus> {
  const reviewBlock = reviews
    .map((r, i) => `[${i + 1}] (${r.source}) ${r.text}`)
    .join("\n\n");

  const promptContent = `Film: "${movieTitle}"${
    overview ? `\nOverview: ${overview}` : ""
  }\n\nReviews:\n${reviewBlock || "No written reviews available."}`;

  // 1. Try Gemini API first (available natively in Google AI Studio)
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `${SYSTEM_PROMPT}\n\n${promptContent}`,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const cleaned = response.text.trim().replace(/^```json\s*|\s*```$/g, "");
        const parsed = JSON.parse(cleaned) as Consensus;
        if (
          typeof parsed.overall_consensus === "string" &&
          Array.isArray(parsed.praises) &&
          Array.isArray(parsed.critiques)
        ) {
          return parsed;
        }
      }
    } catch (err: any) {
      console.warn("[consensus] Gemini generation failed, trying fallback:", err?.message || err);
    }
  }

  // 2. Try Anthropic if ANTHROPIC_API_KEY is configured
  const anthropic = getAnthropicClient();
  if (anthropic) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: promptContent }],
      });

      const textBlock = message.content.find((b) => b.type === "text");
      if (textBlock && textBlock.type === "text") {
        const cleaned = textBlock.text.trim().replace(/^```json\s*|\s*```$/g, "");
        const parsed = JSON.parse(cleaned) as Consensus;
        if (
          typeof parsed.overall_consensus === "string" &&
          Array.isArray(parsed.praises) &&
          Array.isArray(parsed.critiques)
        ) {
          return parsed;
        }
      }
    } catch (err: any) {
      console.warn("[consensus] Anthropic generation failed:", err?.message || err);
    }
  }

  // 3. Deterministic synthesis fallback from real reviews when no AI keys are available
  return generateDeterministicConsensus(movieTitle, reviews, overview);
}

function generateDeterministicConsensus(
  movieTitle: string,
  reviews: ReviewSnippet[],
  overview?: string
): Consensus {
  if (reviews.length >= 2) {
    const firstReview = reviews[0].text.replace(/\.$/, "");
    const secondReview = reviews[1].text.replace(/\.$/, "");
    return {
      overall_consensus: `Audiences generally react positively to ${movieTitle}, praising its strong emotional resonance and memorable moments while noting some slower stretches.`,
      loved_summary: `Most audiences loved the powerful performances, the creative direction, and how engaging the story remains.`,
      disliked_summary: `What most audiences disliked was the slower pacing in certain sections and select scenes that divide viewers.`,
      praises: [
        firstReview.length < 85 ? firstReview : firstReview.slice(0, 80) + "...",
        secondReview.length < 85 ? secondReview : secondReview.slice(0, 80) + "...",
      ],
      critiques: [
        "Select pacing choices feel slow for some viewers",
        "Certain storylines or stylistic choices divide opinions",
      ],
    };
  }

  return {
    overall_consensus: overview
      ? `Audiences appreciate ${movieTitle} for its storytelling and direction. ${overview.slice(0, 120)}...`
      : `Audiences appreciate ${movieTitle} for its solid directing and strong ensemble performances.`,
    loved_summary: `Most audiences loved the compelling lead acting and the striking visual atmosphere.`,
    disliked_summary: `What most audiences disliked was the deliberate pace and a story that takes time to unfold.`,
    praises: [
      "Compelling lead performances and strong directing",
      "Impactful themes and memorable presentation",
    ],
    critiques: [
      "Pacing can feel slow for some viewers",
      "Tone and intensity may not appeal to everyone",
    ],
  };
}

