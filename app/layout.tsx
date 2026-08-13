import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.resumi.live"),
  title: "Resumi | Job-winning resumes in minutes",
  description:
    "Create a resume free with no signup. Enter your details, choose professional templates, preview live, and download a polished PDF instantly.",
  alternates: {
    canonical: "https://www.resumi.live",
  },
  openGraph: {
    title: "Resumi | Job-winning resumes in minutes",
    description: "Create ATS-friendly resumes, cover letters, and polished PDF exports with Resumi. No signup required during launch.",
    url: "https://www.resumi.live",
    siteName: "Resumi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resumi | Job-winning resumes in minutes",
    description: "Build and download a polished PDF resume free, with no signup required.",
  },
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
