import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "MovieLab",
    short_name: "MovieLab",
    description: "Search a film. See what IMDb, Rotten Tomatoes, and Letterboxd actually think.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0e1117",
    theme_color: "#0e1117",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
