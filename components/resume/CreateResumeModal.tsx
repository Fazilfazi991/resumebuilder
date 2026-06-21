"use client";

import { SubmitButton } from "@/components/app/SubmitButton";
import { Bot, FileText, LayoutTemplate, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type CreateResumeModalProps = {
  createAction: (formData: FormData) => void | Promise<void>;
  buttonLabel?: string;
  buttonClassName?: string;
};

export function CreateResumeModal({ createAction, buttonLabel = "Create Resume", buttonClassName }: CreateResumeModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClassName ?? "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"}
      >
        <Plus size={17} aria-hidden="true" />
        {buttonLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <section className="w-full max-w-4xl rounded-lg border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Create your resume</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Choose how you want to begin. You can change templates anytime.</p>
                <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-900">Enter your details once. Try every template instantly.</p>
              </div>
              <button onClick={() => setOpen(false)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Close create resume modal">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <article className="rounded-lg border border-blue-200 bg-blue-50/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm"><FileText size={20} /></div>
                  <span className="rounded-full bg-blue-700 px-2.5 py-1 text-xs font-bold text-white">Recommended</span>
                </div>
                <h3 className="mt-4 font-bold text-slate-950">Start with details</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">Fill your information first. You can preview and switch templates anytime.</p>
                <form action={createAction} className="mt-4">
                  <input type="hidden" name="templateId" value="modern-minimal" />
                  <input type="hidden" name="startMode" value="details" />
                  <SubmitButton className="w-full" pendingText="Creating resume...">Start with details</SubmitButton>
                </form>
              </article>

              <article className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-blue-700"><LayoutTemplate size={20} /></div>
                <h3 className="mt-4 font-bold text-slate-950">Choose a template</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">Pick a design first, then add your details.</p>
                <Link href="/templates?intent=create" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-50">Browse templates</Link>
              </article>

              <article className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-blue-700"><Bot size={20} /></div>
                <h3 className="mt-4 font-bold text-slate-950">Use Assistant</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">Answer a few questions and Resumi will prepare your first draft.</p>
                <form action={createAction} className="mt-4">
                  <input type="hidden" name="templateId" value="modern-minimal" />
                  <input type="hidden" name="tab" value="assistant" />
                  <SubmitButton variant="secondary" className="w-full" pendingText="Starting assistant...">Start assistant</SubmitButton>
                </form>
              </article>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
