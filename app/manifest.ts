import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Resumi",
    short_name: "Resumi",
    description: "Build, preview, and download a professional resume.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#2563eb",
    icons: [{ src: "/brand/resumi-app-icon.png", sizes: "512x512", type: "image/png" }],
  };
}
