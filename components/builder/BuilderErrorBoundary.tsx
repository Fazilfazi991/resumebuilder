"use client";

import Link from "next/link";
import { Component, type ErrorInfo, type ReactNode } from "react";

type BuilderErrorBoundaryProps = {
  children: ReactNode;
};

type BuilderErrorBoundaryState = {
  hasError: boolean;
};

export class BuilderErrorBoundary extends Component<BuilderErrorBoundaryProps, BuilderErrorBoundaryState> {
  state: BuilderErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Builder crashed", error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
        <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-slate-950">Something went wrong while loading the builder.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Reload the builder and your latest device draft will be checked automatically.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={() => window.location.reload()} className="min-h-11 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white">Reload builder</button>
            <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700">Go to Dashboard</Link>
          </div>
        </section>
      </main>
    );
  }
}
