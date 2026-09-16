# MovieLab — implementation blueprint

## 1. Design system

**Palette**
| Token | Hex | Use |
|---|---|---|
| `base-950` | `#0A0B0D` | page background |
| `base-900` | `#111318` | card background |
| `base-800` | `#1B1E25` | hover / raised surface |
| `base-700` | `#282C35` | borders |
| `ink-100` | `#F4F5F7` | primary text |
| `ink-500` | `#7D8190` | muted text |
| `accent` | `#5EE6C1` | mint — reserved for the play button, focus rings, and the AI sparkle icon only. Not used decoratively elsewhere, so it stays meaningful. |

Source colors (`#F5C518` IMDb yellow, `#FA320A` RT red, `#00E054` Letterboxd green) are used only as small rating-card labels — never as full backgrounds — so the grid stays legible against the dark theme instead of turning into three clashing brand blocks.

**Type**
- Display: Clash Display (600/700) for H1s and the wordmark — distributed by Fontshare, not Google Fonts, so it's loaded via a `<link>` in `layout.tsx` for prototyping. Self-host the woff2 for production (see comment in that file).
- Body: Space Grotesk, loaded natively through `next/font/google` — gives it the geometric, slightly technical character that fits a data-forward app without defaulting to a generic system sans.

**Components:** pill radius (`999px`) for buttons/search/tags, `20px` card radius for containers, `1px` `base-700` borders instead of shadows — shadows read poorly on near-black, borders read as premium and match the "clean lines" brief. Icons are Lucide React throughout (`strokeWidth={1.75}` kept consistent app-wide so nothing looks heavier than its neighbor).

## 2. Project structure

```
app/
  layout.tsx              # fonts + shell
  page.tsx                # landing / search
  movie/[id]/page.tsx      # detail view
  api/
    search/route.ts        # TMDB autocomplete
    movie/[id]/route.ts     # aggregated payload (metadata+ratings+consensus)
    consensus/route.ts      # standalone AI summarizer endpoint
components/
  Logo.tsx  SearchBar.tsx  HeroPoster.tsx  RatingGrid.tsx  ConsensusCard.tsx
lib/
  tmdb.ts                  # TMDB client
  consensus.ts             # Claude call + structured output
  cache.ts                 # Upstash Redis w/ in-memory fallback
  types.ts
  scrapers/
    omdb.ts                # IMDb + RT scores via OMDb (not direct scraping)
    letterboxd.ts           # cheerio scrape of public film page meta tags
```

## 3. Data strategy — why OMDb instead of scraping IMDb/RT directly

IMDb and Rotten Tomatoes both render scores via JS and actively rate-limit/fingerprint scrapers, and their ToS prohibit automated collection. **OMDb** (`omdbapi.com`) already licenses this data and returns IMDb + RT critic scores from one call, keyed by IMDb id (pulled from TMDB's `external_ids`) — so it's the compliant, stable path rather than a Puppeteer job fighting anti-bot measures. Its free tier is 1,000 req/day, which the cache layer is built to stay well under.

RT's **audience** score isn't in OMDb's payload — there's no fully compliant self-serve path to it. `omdb.ts` documents three real options (official RT partner API, a cached Puppeteer read of the page's JSON-LD, or omitting it) and ships with the third as the safe default; the UI already handles `audienceScore.available === false` gracefully.

**Letterboxd** has no API, so `letterboxd.ts` scrapes the public film page — but reads it from the stable `twitter:data2`/`twitter:label2` meta tags (server-rendered, survives redesigns) rather than parsing visible markup, and sends a descriptive User-Agent instead of impersonating a browser.

**Defensive fallback**, applied everywhere: every scraper/fetcher catches its own errors and returns an `available: false` rating object instead of throwing, `Promise.allSettled` ensures one blocked source never takes down the others, and the UI (`RatingCard`, `ConsensusCard`) renders "—" / an explanatory empty state rather than crashing or showing `undefined`.

## 4. AI consensus

`lib/consensus.ts` calls Claude with a system prompt that forces raw JSON matching the `Consensus` shape (`overall_consensus`, `praises[2]`, `critiques[2]`), explicitly bans emojis/markdown/all-caps since the strings render directly inside Space Grotesk UI text, and the route defensively re-validates the parsed shape before it ever reaches the client. The whole aggregated payload — metadata, ratings, and the generated consensus — is cached together under one `movie:{id}` key so a page load after the first is a single cache read, not five parallel calls.

## 5. Setup

```bash
npx create-next-app@latest movielab --typescript --tailwind --app
cd movielab
npm install @anthropic-ai/sdk @upstash/redis cheerio lucide-react
```

`.env.local`:
```
TMDB_ACCESS_TOKEN=
OMDB_API_KEY=
ANTHROPIC_API_KEY=
UPSTASH_REDIS_REST_URL=      # optional — falls back to in-memory cache without it
UPSTASH_REDIS_REST_TOKEN=    # optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Drop these files into that scaffold in place, add the `@/*` path alias to `tsconfig.json` if `create-next-app` didn't already, and `npm run dev`.

## What's stubbed vs. production-ready

- **Production-ready:** TMDB metadata/trailer, OMDb ratings, caching, consensus generation, all UI components, layout-shift-free trailer swap.
- **Needs a decision before shipping:** RT audience score source (see `omdb.ts`), and a real IMDb/RT review-text source for the consensus corpus — currently only Letterboxd contributes review text, since IMDb/RT prose isn't in OMDb's payload. Either add a compliant review source for those two or note in the UI that the summary weights Letterboxd more heavily today.
