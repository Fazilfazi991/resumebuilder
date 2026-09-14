import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.resumi.live"),
  title: {
    default: "Resumi | Build a professional resume free",
    template: "%s | Resumi",
  },
  description:
    "Create a resume free with no signup. Enter your details, choose professional templates, preview live, and download a polished PDF instantly.",
  alternates: {
    canonical: "https://www.resumi.live",
  },
  openGraph: {
    title: "Resumi | Build a professional resume free",
    description: "Create ATS-friendly resumes, cover letters, and polished PDF exports with Resumi. No signup required during launch.",
    url: "https://www.resumi.live",
    siteName: "Resumi",
    type: "website",
    images: [{ url: "/brand/resumi-logo.png", width: 1576, height: 499, alt: "Resumi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resumi | Build a professional resume free",
    description: "Build and download a polished PDF resume free, with no signup required.",
    images: ["/brand/resumi-logo.png"],
  },
  icons: { icon: "/icon.png", apple: "/brand/resumi-app-icon.png" },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
