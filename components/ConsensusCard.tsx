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

  return (
    <div className="rounded-card border border-base-700 bg-base-900 px-5 py-5 flex flex-col gap-5">
      <div className="flex items-start gap-2.5">
        <Sparkles size={17} className="mt-0.5 shrink-0 text-accent" strokeWidth={1.75} />
        <p className="text-[15px] leading-relaxed text-ink-100">{consensus.overall_consensus}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-ink-300">
            <ThumbsUp size={15} strokeWidth={1.75} />
            <span className="text-xs font-medium">Praised</span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {consensus.praises.map((point, i) => (
              <li key={i} className="text-sm text-ink-300 leading-snug">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-ink-300">
            <ThumbsDown size={15} strokeWidth={1.75} />
            <span className="text-xs font-medium">Criticized</span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {consensus.critiques.map((point, i) => (
              <li key={i} className="text-sm text-ink-300 leading-snug">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
