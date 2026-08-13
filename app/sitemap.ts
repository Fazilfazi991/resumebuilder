import type { MetadataRoute } from "next";

const routes = [
  "",
  "/templates",
  "/pricing",
  "/ai-tools",
  "/resume-examples",
  "/about",
  "/contact",
  "/help",
  "/privacy-policy",
  "/cover-letter",
  "/builder/guest",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.resumi.live";
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
  }));
}
