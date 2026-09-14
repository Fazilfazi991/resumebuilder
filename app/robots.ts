import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/dashboard", "/my-resumes", "/settings", "/billing", "/login", "/signup", "/forgot-password", "/reset-password", "/auth/", "/api/", "/builder/new"],
    },
    sitemap: "https://www.resumi.live/sitemap.xml",
  };
}
