import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vuior Pay",
    short_name: "Vuior",
    description: "Manage your bills and payment notifications.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f8faf9",
    theme_color: "#008f60",
    icons: [{ src: "/favicon.png", type: "image/png" }],
  };
}
