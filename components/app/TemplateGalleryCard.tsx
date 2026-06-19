import { Eye, LockKeyhole, WandSparkles } from "lucide-react";
import { A4Preview } from "./A4Preview";
import { AppButton } from "./AppButton";
import { SubmitButton } from "./SubmitButton";
import { sampleTemplateData, sampleTemplateSectionOrder } from "@/lib/resume/sample-template-data";

type TemplateGalleryCardProps = {
  id: string;
  name: string;
  category: string;
  description: string;
  bestFor: string;
  tags: string[];
  features: string[];
  isPremium: boolean;
  supportsPhoto?: boolean;
  isReferralUnlocked?: boolean;
  onPreview?: () => void;
  createAction?: (formData: FormData) => void | Promise<void>;
};

export function TemplateGalleryCard({ id, name, category, description, bestFor, tags, features, isPremium, supportsPhoto, isReferralUnlocked = false, onPreview, createAction }: TemplateGalleryCardProps) {
  const premiumLabel = isReferralUnlocked ? "Referral unlocked" : "Premium";

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-300/60">
      <div className="relative bg-slate-100 p-3 pb-0 sm:p-4"><A4Preview templateId={id} data={sampleTemplateData} sectionOrder={sampleTemplateSectionOrder} /><div className="pointer-events-none absolute inset-x-3 bottom-0 h-12 bg-gradient-to-t from-slate-100 to-transparent sm:inset-x-4 sm:h-16" /></div>
      <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{name}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{category}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${isReferralUnlocked ? "bg-amber-50 text-amber-700" : isPremium ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>
          {isPremium ? <LockKeyhole size={12} aria-hidden="true" /> : <WandSparkles size={12} aria-hidden="true" />}
          {isPremium ? premiumLabel : "Free"}
        </span>
      </div>
      <div className="mt-3">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${supportsPhoto ? "bg-cyan-50 text-cyan-700" : "bg-slate-100 text-slate-500"}`}>
          {supportsPhoto ? "Photo supported" : "No photo"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{description}</p>
      <p className="mt-3 text-sm text-slate-600"><span className="font-bold text-slate-900">Best for:</span> {bestFor}</p>
      <ul className="mt-4 grid gap-2 text-xs font-semibold text-slate-600">
        {features.slice(0, 3).map((feature) => <li key={feature} className="rounded-lg bg-slate-50 px-3 py-2">{feature}</li>)}
      </ul>
      <div className="mt-3 flex flex-wrap gap-1.5">{tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{tag}</span>)}</div>
      <div className="mt-4 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
        {createAction ? (
          <form action={createAction}>
            <input type="hidden" name="templateId" value={id} />
            <SubmitButton className="w-full" pendingText="Creating...">{isReferralUnlocked ? "Use Unlocked" : "Use Template"}</SubmitButton>
          </form>
        ) : (
          <AppButton href={`/builder/guest?template=${id}`}>{isReferralUnlocked ? "Use Unlocked" : "Use Template"}</AppButton>
        )}
        <AppButton variant="secondary" onClick={onPreview}><Eye size={16} aria-hidden="true" /> Preview</AppButton>
      </div>
      </div>
    </article>
  );
}
