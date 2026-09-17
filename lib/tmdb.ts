import { MovieSummary, Consensus, WatchProviders, WatchProvider, CastMember } from "./types";
import { findYouTubeTrailer } from "./scrapers/youtube";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

export function formatRuntime(minutes: number | null | undefined): string | null {
  if (!minutes || typeof minutes !== "number" || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export interface CuratedMovie {
  id: number;
  title: string;
  year: string;
  runtime?: string;
  overview: string;
  genres?: string[];
  cast?: CastMember[];
  posterUrl: string;
  backdropUrl: string;
  trailerYouTubeId: string;
  imdbId: string;
  ratings?: {
    imdb: { score: number; displayScore: string; voteCount: string };
    rtCritics: { score: number; displayScore: string };
    rtAudience: { score: number; displayScore: string };
    letterboxd: { score: number; displayScore: string; voteCount: string };
  };
  consensus?: Consensus;
  watchProviders?: WatchProviders;
}

export const CURATED_MOVIES: CuratedMovie[] = [
  {
    id: 27205,
    title: "Inception",
    year: "2010",
    overview:
      "Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    posterUrl: `${IMG_BASE}/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg`,
    backdropUrl: `${IMG_BASE}/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg`,
    trailerYouTubeId: "YoHD9XEInc0",
    imdbId: "tt1375666",
    ratings: {
      imdb: { score: 88, displayScore: "8.8/10", voteCount: "2.6M votes" },
      rtCritics: { score: 87, displayScore: "87%" },
      rtAudience: { score: 91, displayScore: "91%" },
      letterboxd: { score: 84, displayScore: "4.2★", voteCount: "2.3M members" },
    },
    consensus: {
      overall_consensus:
        "A mind-bending heist thriller that balances visionary subconscious action with high emotional stakes.",
      loved_summary:
        "Most audiences loved the brilliant dream-within-a-dream concept, Hans Zimmer's iconic score, and the intense zero-gravity action scenes.",
      disliked_summary:
        "What most audiences disliked was the heavy dialogue explaining the dream rules in the first act and how complex the plot can get.",
      praises: [
        "Christopher Nolan's audacious original concept and direction",
        "Hans Zimmer's iconic, pulse-pounding brass score",
        "Leonardo DiCaprio's emotionally resonant central performance",
      ],
      critiques: [
        "Heavy exposition dialogue throughout the opening act",
        "Complex multi-tiered dream mechanics can require multiple viewings",
      ],
    },
    genres: ["Action", "Science Fiction", "Adventure"],
    runtime: "2h 28m",
    cast: [
      { id: 6193, name: "Leonardo DiCaprio", character: "Dom Cobb", profileUrl: `${IMG_BASE}/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg` },
      { id: 24045, name: "Joseph Gordon-Levitt", character: "Arthur", profileUrl: `${IMG_BASE}/w185/dhv9f3A7vD87B4v3bS2jS9HqVfK.jpg` },
      { id: 27578, name: "Elliot Page", character: "Ariadne", profileUrl: `${IMG_BASE}/w185/tp15t95Z5r7d7Cg8L12yK85C4uG.jpg` },
      { id: 2524, name: "Tom Hardy", character: "Eames", profileUrl: `${IMG_BASE}/w185/d8vnQCmx0vY2ap5m6245iQf7fS6.jpg` },
      { id: 3895, name: "Michael Caine", character: "Prof. Stephen Miles", profileUrl: `${IMG_BASE}/w185/klNxO6jO7X5fL7u7F4p9B6G5tB2.jpg` },
      { id: 2037, name: "Cillian Murphy", character: "Robert Fischer", profileUrl: `${IMG_BASE}/w185/dm6VlQfLdJq9i6Wk2y0kGkCgZ7M.jpg` },
    ],
    watchProviders: {
      stream: [
        { id: 8, name: "Netflix", logoUrl: `${IMG_BASE}/w185/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg` },
        { id: 1899, name: "Max", logoUrl: `${IMG_BASE}/w185/6Q3zyfH267kY8108j98dF50n80s.jpg` },
      ],
      buy: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 3, name: "Google Play Movies", logoUrl: `${IMG_BASE}/w185/tbEdFQDwx5LEVr8Wp68XvkjkUZN.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      rent: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 3, name: "Google Play Movies", logoUrl: `${IMG_BASE}/w185/tbEdFQDwx5LEVr8Wp68XvkjkUZN.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      link: "https://www.themoviedb.org/movie/27205-inception/watch",
    },
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: "2008",
    overview:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    posterUrl: `${IMG_BASE}/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
    backdropUrl: `${IMG_BASE}/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg`,
    trailerYouTubeId: "EXeTwQWrcwY",
    imdbId: "tt0468569",
    ratings: {
      imdb: { score: 90, displayScore: "9.0/10", voteCount: "2.9M votes" },
      rtCritics: { score: 94, displayScore: "94%" },
      rtAudience: { score: 94, displayScore: "94%" },
      letterboxd: { score: 88, displayScore: "4.5★", voteCount: "2.9M members" },
    },
    consensus: {
      overall_consensus:
        "Widely considered the gold standard of modern superhero cinema, elevated by Heath Ledger's Oscar-winning performance.",
      loved_summary:
        "Most audiences loved Heath Ledger's unforgettable Joker, the intense realism, and the gripping moral dilemmas throughout.",
      disliked_summary:
        "What most audiences disliked was Batman's harsh gravelly voice and a third act packed with several overlapping climaxes.",
      praises: [
        "Heath Ledger's chaotic and unforgettable tour-de-force performance",
        "Moral complexity and high-stakes philosophical clashes",
        "Visceral practical stuntwork and striking IMAX photography",
      ],
      critiques: [
        "Dense third act with multiple overlapping climaxes",
        "Batman's gravelly vocal delivery divides some viewers",
      ],
    },
    genres: ["Drama", "Action", "Crime", "Thriller"],
    runtime: "2h 32m",
    cast: [
      { id: 3894, name: "Christian Bale", character: "Bruce Wayne / Batman", profileUrl: `${IMG_BASE}/w185/b7fTC9WFkgqGOv77m09E9Y9V34G.jpg` },
      { id: 1810, name: "Heath Ledger", character: "Joker", profileUrl: `${IMG_BASE}/w185/5Y9HnYYa9jF4D0H4r2Zp1YfM3lP.jpg` },
      { id: 1728, name: "Aaron Eckhart", character: "Harvey Dent / Two-Face", profileUrl: `${IMG_BASE}/w185/u5FqMvT1Hn1Z0U77y9jLp8V9P7q.jpg` },
      { id: 3895, name: "Michael Caine", character: "Alfred Pennyworth", profileUrl: `${IMG_BASE}/w185/klNxO6jO7X5fL7u7F4p9B6G5tB2.jpg` },
      { id: 64, name: "Gary Oldman", character: "Jim Gordon", profileUrl: `${IMG_BASE}/w185/2v9Fs9AkZ9qYV7x8w4r5Z6s7p9L.jpg` },
      { id: 192, name: "Morgan Freeman", character: "Lucius Fox", profileUrl: `${IMG_BASE}/w185/oGJQhOpT8S1M58UVvbpbg2mQ5fl.jpg` },
    ],
    watchProviders: {
      stream: [
        { id: 1899, name: "Max", logoUrl: `${IMG_BASE}/w185/6Q3zyfH267kY8108j98dF50n80s.jpg` },
      ],
      buy: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 3, name: "Google Play Movies", logoUrl: `${IMG_BASE}/w185/tbEdFQDwx5LEVr8Wp68XvkjkUZN.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      rent: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 3, name: "Google Play Movies", logoUrl: `${IMG_BASE}/w185/tbEdFQDwx5LEVr8Wp68XvkjkUZN.jpg` },
      ],
      link: "https://www.themoviedb.org/movie/155-the-dark-knight/watch",
    },
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    year: "2024",
    overview:
      "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.",
    posterUrl: `${IMG_BASE}/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg`,
    backdropUrl: `${IMG_BASE}/original/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg`,
    trailerYouTubeId: "Way9Dexny3w",
    imdbId: "tt15239678",
    ratings: {
      imdb: { score: 85, displayScore: "8.5/10", voteCount: "520K votes" },
      rtCritics: { score: 92, displayScore: "92%" },
      rtAudience: { score: 95, displayScore: "95%" },
      letterboxd: { score: 90, displayScore: "4.5★", voteCount: "1.7M members" },
    },
    consensus: {
      overall_consensus:
        "A monumental sci-fi epic featuring massive scale, breathtaking visuals, and an operatic descent into fanaticism.",
      loved_summary:
        "Most audiences loved the incredible sand-worm riding sequences, the jaw-dropping desert visuals, and Timothée Chalamet's intense transformation.",
      disliked_summary:
        "What most audiences disliked was changes made from the original novel and a final battle that felt slightly rushed.",
      praises: [
        "Denis Villeneuve's peerless scale and Greig Fraser's cinematography",
        "Timothée Chalamet's gripping transition into a messianic warlord",
        "Immersive, seat-shaking sound design and score",
      ],
      critiques: [
        "Pacing rush in the climactic showdown on Arrakis",
        "Substantial book deviations for Chani and Alia divide purists",
      ],
    },
    genres: ["Science Fiction", "Adventure"],
    runtime: "2h 46m",
    cast: [
      { id: 1190668, name: "Timothée Chalamet", character: "Paul Atreides", profileUrl: `${IMG_BASE}/w185/8j58iQCp9ll4x92HGv21zT4ef0.jpg` },
      { id: 505710, name: "Zendaya", character: "Chani", profileUrl: `${IMG_BASE}/w185/r2O1eQ3R0eU7E6eJ7Zk5g7F0A8p.jpg` },
      { id: 93070, name: "Rebecca Ferguson", character: "Lady Jessica", profileUrl: `${IMG_BASE}/w185/6NR8f7U2xGkZ7p5hM2hG1p8vK6l.jpg` },
      { id: 3810, name: "Javier Bardem", character: "Stilgar", profileUrl: `${IMG_BASE}/w185/gCjG2h1mP0lH9mK3y7fD4v6sR8e.jpg` },
      { id: 70001, name: "Austin Butler", character: "Feyd-Rautha Harkonnen", profileUrl: `${IMG_BASE}/w185/s7vF0gL3jM7tN2pQ6h8r9d5kX1w.jpg` },
      { id: 1373737, name: "Florence Pugh", character: "Princess Irulan", profileUrl: `${IMG_BASE}/w185/7tzf7jM9bK0qW6eG1t4r9p5L3sH.jpg` },
    ],
    watchProviders: {
      stream: [
        { id: 1899, name: "Max", logoUrl: `${IMG_BASE}/w185/6Q3zyfH267kY8108j98dF50n80s.jpg` },
      ],
      buy: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
        { id: 3, name: "Google Play Movies", logoUrl: `${IMG_BASE}/w185/tbEdFQDwx5LEVr8Wp68XvkjkUZN.jpg` },
      ],
      rent: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      link: "https://www.themoviedb.org/movie/693134-dune-part-two/watch",
    },
  },
  {
    id: 447365,
    title: "Guardians of the Galaxy Vol. 3",
    year: "2023",
    overview:
      "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own. A mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them.",
    posterUrl: `${IMG_BASE}/w780/r2J02Z2OpNTctfOSN2Ydgii51I3.jpg`,
    backdropUrl: `${IMG_BASE}/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg`,
    trailerYouTubeId: "u3V5KDHRQvk",
    imdbId: "tt6791350",
    ratings: {
      imdb: { score: 79, displayScore: "7.9/10", voteCount: "420K votes" },
      rtCritics: { score: 82, displayScore: "82%" },
      rtAudience: { score: 94, displayScore: "94%" },
      letterboxd: { score: 80, displayScore: "4.0★", voteCount: "1.2M members" },
    },
    consensus: {
      overall_consensus:
        "An emotional farewell to Marvel's beloved misfits driven by Rocket's heartfelt backstory and great character payoffs.",
      loved_summary:
        "Most audiences loved Rocket Raccoon's touching origin story, the fun humor, and the creative hallway fight scene.",
      disliked_summary:
        "What most audiences disliked was the darker animal-testing scenes that were tough to watch and an underused Adam Warlock.",
      praises: [
        "Genuinely moving emotional arc for Rocket Raccoon",
        "Inventive single-take hallway action sequence",
        "Satisfying and respectful conclusion for the original team",
      ],
      critiques: [
        "Dark tone and animal experimentation themes felt jarring to some",
        "Adam Warlock subplot felt underutilized",
      ],
    },
    genres: ["Action", "Adventure", "Science Fiction"],
    runtime: "2h 30m",
    cast: [
      { id: 73457, name: "Chris Pratt", character: "Peter Quill / Star-Lord", profileUrl: `${IMG_BASE}/w185/83o3koL82UtUtLO609GH99OWW9N.jpg` },
      { id: 51329, name: "Bradley Cooper", character: "Rocket (voice)", profileUrl: `${IMG_BASE}/w185/2daC5DeXqwkFND0xxutURDRIPEZ.jpg` },
      { id: 8691, name: "Zoe Saldana", character: "Gamora", profileUrl: `${IMG_BASE}/w185/iOVbEGrNdt9uqWW3um26vAQW5hm.jpg` },
      { id: 543530, name: "Dave Bautista", character: "Drax the Destroyer", profileUrl: `${IMG_BASE}/w185/snk6Jb2575Q6Dr6daZOeXvvt5U.jpg` },
      { id: 543261, name: "Karen Gillan", character: "Nebula", profileUrl: `${IMG_BASE}/w185/52sqV8x04zsv0Nq9F4NlS2xXv.jpg` },
      { id: 1399483, name: "Pom Klementieff", character: "Mantis", profileUrl: `${IMG_BASE}/w185/5c77LzW6ZkE3vY9qC5D8kZ8K7gP.jpg` },
    ],
    watchProviders: {
      stream: [
        { id: 337, name: "Disney Plus", logoUrl: `${IMG_BASE}/w185/7qeKGbtm89qV1f69GvR7k6kY9p4.jpg` },
      ],
      buy: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      rent: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      link: "https://www.themoviedb.org/movie/447365-guardians-of-the-galaxy-vol-3/watch",
    },
  },
  {
    id: 872585,
    title: "Oppenheimer",
    year: "2023",
    overview:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, examining the scientific breakthroughs, political betrayal, and haunting guilt that reshaped human history.",
    posterUrl: `${IMG_BASE}/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    backdropUrl: `${IMG_BASE}/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg`,
    trailerYouTubeId: "uYPbbksJxIg",
    imdbId: "tt15398776",
    ratings: {
      imdb: { score: 89, displayScore: "8.9/10", voteCount: "780K votes" },
      rtCritics: { score: 93, displayScore: "93%" },
      rtAudience: { score: 91, displayScore: "91%" },
      letterboxd: { score: 88, displayScore: "4.4★", voteCount: "2.1M members" },
    },
    consensus: {
      overall_consensus:
        "A gripping biographical drama about the father of the atomic bomb, powered by intense performances and pulse-pounding tension.",
      loved_summary:
        "Most audiences loved Cillian Murphy's haunting performance, the breathtaking Trinity bomb test, and Ludwig Göransson's incredible music.",
      disliked_summary:
        "What most audiences disliked was the lengthy 3-hour runtime and the dialogue-heavy courtroom scenes in the final hour.",
      praises: [
        "Magnificent performances from Cillian Murphy and Robert Downey Jr.",
        "Unforgettable tension in the Trinity test sequence",
        "Masterful non-linear editing by Jennifer Lame",
      ],
      critiques: [
        "Dense political hearing dialogue can feel dry in the third hour",
        "Female characters receive comparatively limited screen time",
      ],
    },
    genres: ["Drama", "History"],
    runtime: "3h 0m",
    cast: [
      { id: 2037, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profileUrl: `${IMG_BASE}/w185/dm6VlQfLdJq9i6Wk2y0kGkCgZ7M.jpg` },
      { id: 5081, name: "Emily Blunt", character: "Katherine 'Kitty' Oppenheimer", profileUrl: `${IMG_BASE}/w185/5P3jW0j9qK8s5N7l3D2F7q9z7B.jpg` },
      { id: 1892, name: "Matt Damon", character: "Leslie Groves", profileUrl: `${IMG_BASE}/w185/elSlNgV0xZQ1EkBhGtnHGhgWoPn.jpg` },
      { id: 3223, name: "Robert Downey Jr.", character: "Lewis Strauss", profileUrl: `${IMG_BASE}/w185/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg` },
      { id: 1373737, name: "Florence Pugh", character: "Jean Tatlock", profileUrl: `${IMG_BASE}/w185/7tzf7jM9bK0qW6eG1t4r9p5L3sH.jpg` },
      { id: 3894, name: "Josh Hartnett", character: "Ernest Lawrence", profileUrl: `${IMG_BASE}/w185/hVq0sB1jG6tH8p3lF2k9jN7v5R.jpg` },
    ],
    watchProviders: {
      stream: [
        { id: 386, name: "Peacock", logoUrl: `${IMG_BASE}/w185/8VCV78prwd9QzZnEm0ReO6bERDa.jpg` },
      ],
      buy: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      rent: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      link: "https://www.themoviedb.org/movie/872585-oppenheimer/watch",
    },
  },
  {
    id: 157336,
    title: "Interstellar",
    year: "2014",
    overview:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    posterUrl: `${IMG_BASE}/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    backdropUrl: `${IMG_BASE}/original/rAiYTsqJJR0nh0vRtBDqoqG0e0g.jpg`,
    trailerYouTubeId: "zSWdZVtXT7E",
    imdbId: "tt0816692",
    ratings: {
      imdb: { score: 87, displayScore: "8.7/10", voteCount: "2.1M votes" },
      rtCritics: { score: 73, displayScore: "73%" },
      rtAudience: { score: 86, displayScore: "86%" },
      letterboxd: { score: 86, displayScore: "4.3★", voteCount: "2.4M members" },
    },
    consensus: {
      overall_consensus:
        "An awe-inspiring sci-fi epic that connects massive space exploration with a deeply moving father-daughter bond.",
      loved_summary:
        "Most audiences loved the breathtaking visuals of black holes and giant waves, Hans Zimmer's powerful organ score, and the emotional payoff.",
      disliked_summary:
        "What most audiences disliked was the loud sound mix drowning out dialogue and the sentimental love-transcends-dimensions twist.",
      praises: [
        "Hans Zimmer's transcendent pipe-organ score",
        "Visually jaw-dropping depictions of Gargantua and wormholes",
        "Matthew McConaughey's tearful video-playback scene",
      ],
      critiques: [
        "Climactic 'love transcends dimensions' dialogue felt sentimental to some critics",
        "Audio mix occasionally overpowers dialogue in theaters",
      ],
    },
    genres: ["Adventure", "Drama", "Science Fiction"],
    runtime: "2h 49m",
    cast: [
      { id: 10297, name: "Matthew McConaughey", character: "Joseph Cooper", profileUrl: `${IMG_BASE}/w185/eD2zCqE4c1Z8lG2F6fL7y1v0r3m.jpg` },
      { id: 1813, name: "Anne Hathaway", character: "Dr. Amelia Brand", profileUrl: `${IMG_BASE}/w185/tLsplEgOOQIhWBVLJjU93q9k55E.jpg` },
      { id: 83002, name: "Jessica Chastain", character: "Murphy Cooper", profileUrl: `${IMG_BASE}/w185/3V9y7l6kM1G9p8X2zL5sQ3jK8vN.jpg` },
      { id: 3895, name: "Michael Caine", character: "Professor Brand", profileUrl: `${IMG_BASE}/w185/klNxO6jO7X5fL7u7F4p9B6G5tB2.jpg` },
      { id: 1892, name: "Matt Damon", character: "Dr. Mann", profileUrl: `${IMG_BASE}/w185/elSlNgV0xZQ1EkBhGtnHGhgWoPn.jpg` },
      { id: 932349, name: "Mackenzie Foy", character: "Young Murphy Cooper", profileUrl: `${IMG_BASE}/w185/p8zJ9vL1kF5G3sQ7jH2lR8vN4eW.jpg` },
    ],
    watchProviders: {
      stream: [
        { id: 7, name: "Paramount Plus", logoUrl: `${IMG_BASE}/w185/fi83B1oztoS47xumemAV4mIqJoQ.jpg` },
      ],
      buy: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      rent: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      link: "https://www.themoviedb.org/movie/157336-interstellar/watch",
    },
  },
  {
    id: 496243,
    title: "Parasite",
    year: "2019",
    overview:
      "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    posterUrl: `${IMG_BASE}/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    backdropUrl: `${IMG_BASE}/original/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg`,
    trailerYouTubeId: "5xH0R_uie1U",
    imdbId: "tt6751668",
    ratings: {
      imdb: { score: 85, displayScore: "8.5/10", voteCount: "950K votes" },
      rtCritics: { score: 99, displayScore: "99%" },
      rtAudience: { score: 95, displayScore: "95%" },
      letterboxd: { score: 92, displayScore: "4.6★", voteCount: "3.2M members" },
    },
    consensus: {
      overall_consensus:
        "A masterclass in dark comedy and tension that shifts from hilarious satire to shocking suspense effortlessly.",
      loved_summary:
        "Most audiences loved the brilliant unexpected plot twists, the sharp humor about social classes, and the flawless directing by Bong Joon-ho.",
      disliked_summary:
        "What most audiences disliked was the violent and unsettling climax which can be jarring for unprepared viewers.",
      praises: [
        "Bong Joon-ho's flawless genre transitions and pacing",
        "Incisive, multi-layered critique of modern class divide",
        "Immaculate production design and ensemble acting",
      ],
      critiques: [
        "Unsettling and violent climax may disturb sensitive viewers",
      ],
    },
    genres: ["Comedy", "Thriller", "Drama"],
    runtime: "2h 12m",
    cast: [
      { id: 20738, name: "Song Kang-ho", character: "Kim Ki-taek", profileUrl: `${IMG_BASE}/w185/dyNn5yJm6XlM9p5G3sQ7jH2lR8v.jpg` },
      { id: 70629, name: "Lee Sun-kyun", character: "Park Dong-ik", profileUrl: `${IMG_BASE}/w185/5vL9xQ3jK8vNp8zJ9vL1kF5G3sQ.jpg` },
      { id: 1047710, name: "Cho Yeo-jeong", character: "Choi Yeon-kyo", profileUrl: `${IMG_BASE}/w185/2sQ7jH2lR8vNp8zJ9vL1kF5G3sQ.jpg` },
      { id: 1253360, name: "Choi Woo-shik", character: "Kim Ki-woo", profileUrl: `${IMG_BASE}/w185/8vNp8zJ9vL1kF5G3sQ7jH2lR8vN.jpg` },
      { id: 1253361, name: "Park So-dam", character: "Kim Ki-jung", profileUrl: `${IMG_BASE}/w185/6kM1G9p8X2zL5sQ3jK8vNp8zJ9v.jpg` },
      { id: 1047711, name: "Lee Jung-eun", character: "Gook Moon-gwang", profileUrl: `${IMG_BASE}/w185/3vL1kF5G3sQ7jH2lR8vNp8zJ9vL.jpg` },
    ],
    watchProviders: {
      stream: [
        { id: 1899, name: "Max", logoUrl: `${IMG_BASE}/w185/6Q3zyfH267kY8108j98dF50n80s.jpg` },
      ],
      buy: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      rent: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
        { id: 10, name: "Amazon Video", logoUrl: `${IMG_BASE}/w185/seGSsoGmRxKdEf2DUbt19YQx0ql.jpg` },
      ],
      link: "https://www.themoviedb.org/movie/496243-parasite/watch",
    },
  },
  {
    id: 357841,
    title: "Heneral Luna",
    year: "2015",
    overview:
      "Set during the Philippine-American War, a short-tempered Filipino general faces an enemy more formidable than the American army: his own treacherous countrymen.",
    posterUrl: `${IMG_BASE}/w780/jT4Fv3qZzUjZ4Z9H3vQkC1bY1aP.jpg`,
    backdropUrl: `${IMG_BASE}/original/8M8WfB6O9s9vF2k6G1h8p3lF2k9.jpg`,
    trailerYouTubeId: "I_q32NWN2oU",
    imdbId: "tt4935196",
    ratings: {
      imdb: { score: 76, displayScore: "7.6/10", voteCount: "14K votes" },
      rtCritics: { score: 71, displayScore: "71%" },
      rtAudience: { score: 88, displayScore: "88%" },
      letterboxd: { score: 76, displayScore: "3.8★", voteCount: "42K members" },
    },
    consensus: {
      overall_consensus:
        "A fierce and explosive historical biopic anchored by John Arcilla's thunderous, unforgettable performance as General Antonio Luna.",
      loved_summary:
        "Most audiences loved John Arcilla's fiery and passionate acting, the sharp political dialogue, and the uncompromising critique of factionalism.",
      disliked_summary:
        "What most audiences disliked was occasional theatrical melodrama, abrupt shifts between humor and brutality, and CGI blood effects.",
      praises: [
        "John Arcilla's commanding, iconic titular performance",
        "Unflinching critique of political infighting and treachery",
        "Memorable dialogue and nationalistic resonance",
      ],
      critiques: [
        "Occasional theatrical melodrama and tonal swings",
        "Noticeable CGI blood in battlefield skirmishes",
      ],
    },
    genres: ["History", "War", "Drama", "Action"],
    runtime: "1h 58m",
    cast: [
      { id: 98114, name: "John Arcilla", character: "General Antonio Luna", profileUrl: `${IMG_BASE}/w185/8kZ8K7gP5c77LzW6ZkE3vY9qC5D.jpg` },
      { id: 1399484, name: "Mon Confiado", character: "President Emilio Aguinaldo", profileUrl: `${IMG_BASE}/w185/7tzf7jM9bK0qW6eG1t4r9p5L3sH.jpg` },
      { id: 1399485, name: "Epy Quizon", character: "Apolinario Mabini", profileUrl: null },
      { id: 1399486, name: "Arron Villaflor", character: "Joven Hernando", profileUrl: null },
      { id: 1399487, name: "Joem Bascon", character: "Col. Francisco 'Paco' Roman", profileUrl: null },
      { id: 1399488, name: "Paulo Avelino", character: "Gen. Gregorio del Pilar", profileUrl: null },
    ],
    watchProviders: {
      stream: [
        { id: 8, name: "Netflix", logoUrl: `${IMG_BASE}/w185/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg` },
      ],
      buy: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
      ],
      rent: [
        { id: 2, name: "Apple TV", logoUrl: `${IMG_BASE}/w185/peURlLlr8jggOwK53fJ5wdQl05y.jpg` },
      ],
      link: "https://www.themoviedb.org/movie/357841-heneral-luna/watch",
    },
  },
];

function getTmdbAuth(): {
  headers: Record<string, string>;
  urlWithAuth: (url: string) => string;
} | null {
  const token = (
    process.env.TMDB_ACCESS_TOKEN ||
    process.env.TMDB_API_KEY ||
    process.env.TMDB_TOKEN
  )?.trim();

  if (!token) return null;

  // TMDB v4 Read Access Tokens are JWTs (typically > 50 characters, start with "ey")
  if (token.startsWith("ey") || token.length > 50) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      urlWithAuth: (url: string) => url,
    };
  }

  // TMDB v3 API Key (typically 32 hex characters)
  return {
    headers: {
      accept: "application/json",
    },
    urlWithAuth: (url: string) => {
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}api_key=${encodeURIComponent(token)}`;
    },
  };
}

function searchCurated(query: string): MovieSummary[] {
  const q = query.toLowerCase().trim();
  return CURATED_MOVIES.filter(
    (m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
  ).map((m) => ({
    id: m.id,
    title: m.title,
    year: m.year,
    posterUrl: m.posterUrl,
  }));
}

export async function searchMovies(query: string): Promise<MovieSummary[]> {
  const auth = getTmdbAuth();

  if (!auth) {
    console.info("[tmdb] TMDB credentials not configured. Serving matching results from curated catalog.");
    return searchCurated(query);
  }

  try {
    const url = auth.urlWithAuth(
      `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
    );
    const res = await fetch(url, { headers: auth.headers, next: { revalidate: 3600 } });

    if (res.status === 401 || res.status === 403) {
      console.warn("[tmdb] TMDB authorization failed (401/403). Falling back to curated catalog.");
      return searchCurated(query);
    }

    if (!res.ok) {
      console.warn(`[tmdb] TMDB search returned status ${res.status}. Falling back to curated catalog.`);
      const curated = searchCurated(query);
      if (curated.length > 0) return curated;
      throw new Error(`TMDB search failed: ${res.status}`);
    }

    const data = await res.json();
    const liveResults = (data.results ?? []).slice(0, 8).map((r: any) => ({
      id: r.id,
      title: r.title,
      year: r.release_date ? r.release_date.slice(0, 4) : "—",
      posterUrl: r.poster_path ? `${IMG_BASE}/w500${r.poster_path}` : null,
    }));

    if (liveResults.length === 0) {
      return searchCurated(query);
    }

    return liveResults;
  } catch (err: any) {
    console.warn("[tmdb] searchMovies error caught, falling back to curated:", err.message || err);
    return searchCurated(query);
  }
}

export async function getMovieMetadata(tmdbId: number) {
  const curatedMatch = CURATED_MOVIES.find((m) => m.id === tmdbId);
  const auth = getTmdbAuth();

  if (!auth) {
    if (curatedMatch) {
      return {
        id: curatedMatch.id,
        title: curatedMatch.title,
        year: curatedMatch.year,
        runtime: curatedMatch.runtime ?? null,
        overview: curatedMatch.overview,
        genres: curatedMatch.genres ?? [],
        cast: curatedMatch.cast ?? [],
        posterUrl: curatedMatch.posterUrl,
        backdropUrl: curatedMatch.backdropUrl,
        trailerYouTubeId: curatedMatch.trailerYouTubeId,
        imdbId: curatedMatch.imdbId,
        watchProviders: curatedMatch.watchProviders ?? null,
      };
    }
    console.info(`[tmdb] TMDB credentials not set and movie ${tmdbId} not in curated list.`);
    throw new Error(`TMDB detail not available (no token configured and id ${tmdbId} not in fallback catalog)`);
  }

  try {
    const [detailRes, videosRes, externalIdsRes, providersRes, creditsRes] = await Promise.all([
      fetch(auth.urlWithAuth(`${TMDB_BASE}/movie/${tmdbId}`), { headers: auth.headers }),
      fetch(auth.urlWithAuth(`${TMDB_BASE}/movie/${tmdbId}/videos`), { headers: auth.headers }),
      fetch(auth.urlWithAuth(`${TMDB_BASE}/movie/${tmdbId}/external_ids`), { headers: auth.headers }),
      fetch(auth.urlWithAuth(`${TMDB_BASE}/movie/${tmdbId}/watch/providers`), { headers: auth.headers }).catch(() => null),
      fetch(auth.urlWithAuth(`${TMDB_BASE}/movie/${tmdbId}/credits`), { headers: auth.headers }).catch(() => null),
    ]);

    if (detailRes.status === 401 || detailRes.status === 403) {
      console.warn(`[tmdb] TMDB auth failed (401/403) on detail for ${tmdbId}.`);
      if (curatedMatch) {
        return {
          id: curatedMatch.id,
          title: curatedMatch.title,
          year: curatedMatch.year,
          runtime: curatedMatch.runtime ?? null,
          overview: curatedMatch.overview,
          genres: curatedMatch.genres ?? [],
          cast: curatedMatch.cast ?? [],
          posterUrl: curatedMatch.posterUrl,
          backdropUrl: curatedMatch.backdropUrl,
          trailerYouTubeId: curatedMatch.trailerYouTubeId,
          imdbId: curatedMatch.imdbId,
          watchProviders: curatedMatch.watchProviders ?? null,
        };
      }
      throw new Error(`TMDB detail failed: ${detailRes.status}`);
    }

    if (!detailRes.ok) {
      if (curatedMatch) {
        return {
          id: curatedMatch.id,
          title: curatedMatch.title,
          year: curatedMatch.year,
          runtime: curatedMatch.runtime ?? null,
          overview: curatedMatch.overview,
          genres: curatedMatch.genres ?? [],
          cast: curatedMatch.cast ?? [],
          posterUrl: curatedMatch.posterUrl,
          backdropUrl: curatedMatch.backdropUrl,
          trailerYouTubeId: curatedMatch.trailerYouTubeId,
          imdbId: curatedMatch.imdbId,
          watchProviders: curatedMatch.watchProviders ?? null,
        };
      }
      throw new Error(`TMDB detail failed: ${detailRes.status}`);
    }

    const detail = await detailRes.json();
    const videos = videosRes.ok ? await videosRes.json() : { results: [] };
    const externalIds = externalIdsRes.ok ? await externalIdsRes.json() : {};

    let cast: CastMember[] = [];
    if (creditsRes && creditsRes.ok) {
      try {
        const credData = await creditsRes.json();
        cast = (credData.cast ?? []).slice(0, 12).map((c: any) => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profileUrl: c.profile_path ? `${IMG_BASE}/w185${c.profile_path}` : null,
        }));
      } catch (err) {
        console.warn("[tmdb] Failed to parse credits:", err);
      }
    }
    if (cast.length === 0 && curatedMatch?.cast) {
      cast = curatedMatch.cast;
    }

    const runtime = formatRuntime(detail.runtime) ?? curatedMatch?.runtime ?? null;

    let watchProviders: WatchProviders | null = null;
    if (providersRes && providersRes.ok) {
      try {
        const provData = await providersRes.json();
        const results = provData.results || {};
        // Look up region: priority to US, PH, GB, CA, AU or first country available
        const region =
          results.US ||
          results.PH ||
          results.GB ||
          results.CA ||
          results.AU ||
          (Object.values(results)[0] as any);

        if (region) {
          const toProvider = (p: any): WatchProvider => ({
            id: p.provider_id,
            name: p.provider_name,
            logoUrl: p.logo_path ? `${IMG_BASE}/w185${p.logo_path}` : null,
          });

          const streamList = [
            ...(region.flatrate ?? []),
            ...(region.free ?? []),
            ...(region.ads ?? []),
          ].map(toProvider);
          const streamMap = new Map<number, WatchProvider>();
          for (const s of streamList) {
            if (!streamMap.has(s.id)) streamMap.set(s.id, s);
          }

          const buyList = (region.buy ?? []).map(toProvider);
          const buyMap = new Map<number, WatchProvider>();
          for (const b of buyList) {
            if (!buyMap.has(b.id)) buyMap.set(b.id, b);
          }

          const rentList = (region.rent ?? []).map(toProvider);
          const rentMap = new Map<number, WatchProvider>();
          for (const r of rentList) {
            if (!rentMap.has(r.id)) rentMap.set(r.id, r);
          }

          watchProviders = {
            stream: Array.from(streamMap.values()),
            buy: Array.from(buyMap.values()),
            rent: Array.from(rentMap.values()),
            link: region.link,
          };
        }
      } catch (err) {
        console.warn("[tmdb] Failed to parse watch providers:", err);
      }
    }

    const genres: string[] = (detail.genres ?? []).map((g: any) => g.name);

    const trailer = (videos.results ?? []).find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ?? (videos.results ?? []).find((v: any) => v.site === "YouTube" && v.type === "Trailer")
    ?? (videos.results ?? []).find((v: any) => v.site === "YouTube" && (v.type === "Teaser" || v.type === "Clip"));

    const year = detail.release_date ? detail.release_date.slice(0, 4) : "—";
    let trailerYouTubeId = trailer?.key ?? null;
    if (!trailerYouTubeId) {
      try {
        trailerYouTubeId = await findYouTubeTrailer(detail.title, year !== "—" ? year : undefined);
      } catch (e) {
        console.warn("[tmdb] Trailer scraping fallback error:", e);
      }
    }

    return {
      id: detail.id,
      title: detail.title,
      year,
      runtime,
      overview: detail.overview,
      genres,
      cast,
      posterUrl: detail.poster_path ? `${IMG_BASE}/w780${detail.poster_path}` : null,
      backdropUrl: detail.backdrop_path ? `${IMG_BASE}/original${detail.backdrop_path}` : null,
      trailerYouTubeId,
      imdbId: externalIds.imdb_id ?? null,
      watchProviders: watchProviders ?? curatedMatch?.watchProviders ?? null,
    };
  } catch (err: any) {
    if (curatedMatch) {
      console.warn(`[tmdb] Error fetching tmdb detail for ${tmdbId}, using curated data.`);
      return {
        id: curatedMatch.id,
        title: curatedMatch.title,
        year: curatedMatch.year,
        runtime: curatedMatch.runtime ?? null,
        overview: curatedMatch.overview,
        genres: curatedMatch.genres ?? [],
        cast: curatedMatch.cast ?? [],
        posterUrl: curatedMatch.posterUrl,
        backdropUrl: curatedMatch.backdropUrl,
        trailerYouTubeId: curatedMatch.trailerYouTubeId,
        imdbId: curatedMatch.imdbId,
        watchProviders: curatedMatch.watchProviders ?? null,
      };
    }
    throw err;
  }
}
