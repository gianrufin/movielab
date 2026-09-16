import { MovieRatings } from "@/lib/types";

function RatingCard({
  label,
  accentColor,
  score,
  subscore,
  votes,
  url,
}: {
  label: string;
  accentColor: string;
  score: string;
  subscore?: string;
  votes: string | null;
  url: string;
}) {
  const Card = (
    <div className="flex flex-col gap-1.5 rounded-card border border-base-700 bg-base-900 px-4 py-4 h-full">
      <span
        className="text-[11px] font-medium tracking-wide text-ink-500"
        style={{ color: accentColor }}
      >
        {label}
      </span>
      <span className="font-display text-2xl font-semibold text-ink-100 leading-none">
        {score}
      </span>
      {subscore && <span className="text-xs text-ink-500 leading-none mt-0.5">{subscore}</span>}
      {votes && <span className="text-xs text-ink-500 mt-1">{votes}</span>}
    </div>
  );

  if (!url) return Card;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
      {Card}
    </a>
  );
}

export function RatingGrid({ ratings }: { ratings: MovieRatings }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <RatingCard
        label="IMDb"
        accentColor="#F5C518"
        score={ratings.imdb.displayScore}
        votes={ratings.imdb.voteCount}
        url={ratings.imdb.url}
      />
      <RatingCard
        label="Rotten Tomatoes"
        accentColor="#FA320A"
        score={ratings.rottenTomatoes.displayScore}
        subscore={
          ratings.rottenTomatoes.audienceScore?.available
            ? `Audience ${ratings.rottenTomatoes.audienceScore.displayScore}`
            : undefined
        }
        votes={ratings.rottenTomatoes.voteCount}
        url={ratings.rottenTomatoes.url}
      />
      <RatingCard
        label="Letterboxd"
        accentColor="#00E054"
        score={ratings.letterboxd.displayScore}
        votes={ratings.letterboxd.voteCount}
        url={ratings.letterboxd.url}
      />
    </div>
  );
}
