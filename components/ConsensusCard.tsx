import { ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { Consensus } from "@/lib/types";

export function ConsensusCard({ consensus }: { consensus: Consensus | null }) {
  if (!consensus) {
    return (
      <div className="rounded-card border border-base-700 bg-base-900 px-5 py-6 text-sm text-ink-500">
        Not enough audience reviews yet to summarize a consensus for this title.
      </div>
    );
  }

  const lovedSummaryText =
    consensus.loved_summary ||
    (consensus.praises && consensus.praises.length > 0
      ? `Most audiences loved ${consensus.praises
          .map((p) => p.charAt(0).toLowerCase() + p.slice(1).replace(/\.$/, ""))
          .join(", and ")}.`
      : "Most audiences had positive impressions of the performances and overall direction.");

  const dislikedSummaryText =
    consensus.disliked_summary ||
    (consensus.critiques && consensus.critiques.length > 0
      ? `What most audiences disliked was ${consensus.critiques
          .map((c) => c.charAt(0).toLowerCase() + c.slice(1).replace(/\.$/, ""))
          .join(", and ")}.`
      : "What some audiences disliked was the deliberate pacing in certain scenes.");

  return (
    <div className="rounded-card border border-base-700 bg-base-900/90 backdrop-blur-md px-5 py-5 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-base-700/60">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" strokeWidth={2} />
          <span className="font-display text-sm font-semibold tracking-wide text-ink-100 uppercase">
            Audience Review Summary
          </span>
        </div>
        <span className="text-xs text-ink-500">Common consensus</span>
      </div>

      {consensus.overall_consensus && (
        <p className="text-[14px] leading-relaxed text-ink-200">
          {consensus.overall_consensus}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 transition-colors">
          <div className="flex items-center gap-2 text-emerald-400">
            <ThumbsUp size={15} strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              What most audiences loved
            </span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-ink-100 font-medium">
            {lovedSummaryText}
          </p>
          {consensus.praises && consensus.praises.length > 0 && (
            <ul className="flex flex-col gap-1.5 pt-1 border-t border-emerald-500/10">
              {consensus.praises.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-ink-300 leading-snug">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2.5 rounded-xl border border-rose-500/20 bg-rose-950/20 p-4 transition-colors">
          <div className="flex items-center gap-2 text-rose-400">
            <ThumbsDown size={15} strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              What audiences disliked
            </span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-ink-100 font-medium">
            {dislikedSummaryText}
          </p>
          {consensus.critiques && consensus.critiques.length > 0 && (
            <ul className="flex flex-col gap-1.5 pt-1 border-t border-rose-500/10">
              {consensus.critiques.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-ink-300 leading-snug">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400/80" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

