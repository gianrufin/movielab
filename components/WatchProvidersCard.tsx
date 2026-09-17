import Image from "next/image";
import { Tv, Play, ShoppingBag, ExternalLink } from "lucide-react";
import { WatchProviders, WatchProvider } from "@/lib/types";

interface WatchProvidersCardProps {
  providers: WatchProviders | null | undefined;
  title: string;
}

function getPlatformSearchUrl(providerName: string, movieTitle: string, defaultLink?: string): string {
  const lower = providerName.toLowerCase();
  if (lower.includes("netflix")) {
    return `https://www.netflix.com/search?q=${encodeURIComponent(movieTitle)}`;
  }
  if (lower.includes("apple")) {
    return `https://tv.apple.com/search?term=${encodeURIComponent(movieTitle)}`;
  }
  if (lower.includes("amazon") || lower.includes("prime")) {
    return `https://www.amazon.com/s?k=${encodeURIComponent(movieTitle)}&i=instant-video`;
  }
  if (lower.includes("google") || lower.includes("play")) {
    return `https://play.google.com/store/search?q=${encodeURIComponent(movieTitle)}&c=movies`;
  }
  if (lower.includes("youtube")) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + " movie")}`;
  }
  if (lower.includes("disney")) {
    return `https://www.disneyplus.com/search?q=${encodeURIComponent(movieTitle)}`;
  }
  if (lower.includes("max") || lower.includes("hbo")) {
    return `https://play.max.com/search?q=${encodeURIComponent(movieTitle)}`;
  }
  if (defaultLink) return defaultLink;
  return `https://www.google.com/search?q=${encodeURIComponent(`watch ${movieTitle} on ${providerName}`)}`;
}

export function WatchProvidersCard({ providers, title }: WatchProvidersCardProps) {
  const hasStream = (providers?.stream?.length ?? 0) > 0;
  const buyList = providers?.buy ?? [];
  const rentList = providers?.rent ?? [];

  // Merge buy and rent lists without duplicates
  const purchaseMap = new Map<number, WatchProvider>();
  for (const item of [...buyList, ...rentList]) {
    if (!purchaseMap.has(item.id)) {
      purchaseMap.set(item.id, item);
    }
  }
  const purchaseProviders = Array.from(purchaseMap.values());
  const hasPurchase = purchaseProviders.length > 0;

  const justWatchUrl =
    providers?.link ||
    `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`;

  return (
    <section
      aria-labelledby="watch-options-heading"
      className="rounded-xl border border-base-700/60 bg-base-900/60 p-4 sm:p-5 flex flex-col gap-4 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-base-800 pb-3">
        <div className="flex items-center gap-2">
          <Tv size={18} className="text-accent" strokeWidth={2} />
          <h2 id="watch-options-heading" className="text-sm font-semibold tracking-wide text-ink-100">
            Where to Watch
          </h2>
        </div>
        <a
          href={justWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ink-500 hover:text-ink-300 transition-colors flex items-center gap-1"
        >
          <span>Via JustWatch</span>
          <ExternalLink size={12} strokeWidth={1.75} />
        </a>
      </div>

      {/* Streaming Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Play size={12} className="fill-emerald-400" />
          <span>Stream</span>
        </div>

        {hasStream ? (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {providers!.stream.map((provider) => (
              <a
                key={provider.id}
                href={getPlatformSearchUrl(provider.name, title, providers?.link)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Watch ${title} on ${provider.name}`}
                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-base-800/80 border border-base-700/70 hover:border-emerald-500/50 hover:bg-base-800 transition-all text-ink-200 hover:text-ink-100"
              >
                {provider.logoUrl ? (
                  <div className="relative w-5 h-5 rounded overflow-hidden flex-shrink-0 bg-base-900">
                    <Image
                      src={provider.logoUrl}
                      alt={provider.name}
                      width={20}
                      height={20}
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                    {provider.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-medium whitespace-nowrap">{provider.name}</span>
                <ExternalLink size={11} className="text-ink-500 group-hover:text-emerald-400 transition-colors" />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-xs text-ink-500 py-1 flex items-center gap-2">
            <span>No subscription streaming detected in this region.</span>
            <a
              href={`https://www.netflix.com/search?q=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-400 hover:text-ink-200 underline underline-offset-2"
            >
              Check Netflix
            </a>
          </div>
        )}
      </div>

      {/* Purchase & Rent Section */}
      <div className="flex flex-col gap-2 pt-1 border-t border-base-800/80">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-400 pt-1">
          <ShoppingBag size={12} />
          <span>Buy or Rent</span>
        </div>

        {hasPurchase ? (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {purchaseProviders.map((provider) => (
              <a
                key={provider.id}
                href={getPlatformSearchUrl(provider.name, title, providers?.link)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Rent or buy ${title} on ${provider.name}`}
                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-base-800/80 border border-base-700/70 hover:border-sky-500/50 hover:bg-base-800 transition-all text-ink-200 hover:text-ink-100"
              >
                {provider.logoUrl ? (
                  <div className="relative w-5 h-5 rounded overflow-hidden flex-shrink-0 bg-base-900">
                    <Image
                      src={provider.logoUrl}
                      alt={provider.name}
                      width={20}
                      height={20}
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded bg-sky-950 text-sky-400 flex items-center justify-center text-[10px] font-bold">
                    {provider.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-medium whitespace-nowrap">{provider.name}</span>
                <ExternalLink size={11} className="text-ink-500 group-hover:text-sky-400 transition-colors" />
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <a
              href={`https://tv.apple.com/search?term=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-base-800 border border-base-700/60 text-xs text-ink-300 hover:text-ink-100 hover:border-base-600 transition-colors"
            >
              Apple TV
            </a>
            <a
              href={`https://play.google.com/store/search?q=${encodeURIComponent(title)}&c=movies`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-base-800 border border-base-700/60 text-xs text-ink-300 hover:text-ink-100 hover:border-base-600 transition-colors"
            >
              Google Play
            </a>
            <a
              href={`https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-base-800 border border-base-700/60 text-xs text-ink-300 hover:text-ink-100 hover:border-base-600 transition-colors"
            >
              Amazon Video
            </a>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + " movie buy or rent")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-base-800 border border-base-700/60 text-xs text-ink-300 hover:text-ink-100 hover:border-base-600 transition-colors"
            >
              YouTube Movies
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
