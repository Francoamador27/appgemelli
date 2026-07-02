import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gemelli Boat",
    short_name: "Gemelli Boat",
    description: "Gestione delle prenotazioni di imbarcazioni - Gemelli Boat",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f4c5c",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
