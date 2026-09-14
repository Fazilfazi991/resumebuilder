import type { Metadata } from "next";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const socialTitle = `${title} | Resumi`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: "Resumi",
      type: "website",
      images: [{ url: "/brand/resumi-logo.png", width: 1576, height: 499, alt: "Resumi" }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/brand/resumi-logo.png"],
    },
  };
}
