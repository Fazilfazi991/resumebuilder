import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeCraft | Job-winning resumes in minutes",
  description:
    "Enter your details once, choose professional templates, preview live, and download polished PDF resumes instantly.",
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
