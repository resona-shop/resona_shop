import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.slogan}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#FF8C42",
    icons: [
      {
        src: "/resona-logo.png",
        sizes: "1693x562",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
