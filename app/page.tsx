import { Footer } from "@/components/landing/Footer";
import { Homepage } from "@/components/landing/Homepage";
import { Navbar } from "@/components/landing/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Resumi | Build a professional resume free" },
  description: "Create, preview, and download a professional resume free with no signup required and every current template included.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Homepage />
      <Footer />
    </>
  );
}
