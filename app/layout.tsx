import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://resumi.live"),
  title: "Resumi | Job-winning resumes in minutes",
  description:
    "Enter your details once, choose professional templates, preview live, and download polished PDF resumes instantly.",
  alternates: {
    canonical: "https://resumi.live",
  },
  openGraph: {
    title: "Resumi | Job-winning resumes in minutes",
    description: "Create ATS-friendly resumes, cover letters, and polished PDF exports with Resumi.",
    url: "https://resumi.live",
    siteName: "Resumi",
    type: "website",
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
