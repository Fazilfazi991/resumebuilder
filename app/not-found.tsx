import type { Metadata } from "next";
import { AppButton } from "@/components/app/AppButton";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16 text-center">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-blue-700">404</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">That page is not available</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">The link may be outdated, or the page may have moved. You can return home or start a resume without signing in.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3"><AppButton href="/">Return Home</AppButton><AppButton href="/builder/guest" variant="secondary">Create Resume Free</AppButton></div>
        </div>
      </main>
      <Footer />
    </>
  );
}
