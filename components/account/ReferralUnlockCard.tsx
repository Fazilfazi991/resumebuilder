"use client";

import { AppButton } from "@/components/app/AppButton";
import { Gift, Link2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const referralCountKey = "resumi_referral_count";
const unlockedTemplateKey = "resumi_unlocked_template";
const unlockedTemplateId = "creative-portfolio";

export function ReferralUnlockCard() {
  const [origin, setOrigin] = useState("");
  const [referrals, setReferrals] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    setReferrals(Number(localStorage.getItem(referralCountKey) ?? "0"));
  }, []);

  const referralCode = "SOPHIA92";
  const referralLink = useMemo(() => `${origin || "https://resumi.live"}?ref=${referralCode}`, [origin]);
  const isUnlocked = referrals >= 1;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const markReferralComplete = () => {
    const nextCount = Math.max(1, referrals + 1);
    localStorage.setItem(referralCountKey, String(nextCount));
    localStorage.setItem(unlockedTemplateKey, unlockedTemplateId);
    setReferrals(nextCount);
  };

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Gift size={21} aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-blue-700">Referral rewards</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Refer 1 friend. Unlock 1 premium template.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Share your referral link. Once one friend joins, the Creative Portfolio premium template unlocks for your account.
          </p>
        </div>
        <div className={`rounded-lg px-4 py-3 text-sm font-bold ${isUnlocked ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
          {isUnlocked ? "Creative Portfolio unlocked" : `${referrals}/1 referral completed`}
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
          <span className="block truncate">{referralLink}</span>
        </div>
        <AppButton variant="secondary" onClick={copyLink}>
          <Link2 size={16} aria-hidden="true" />
          {copied ? "Copied" : "Copy Link"}
        </AppButton>
        <AppButton onClick={markReferralComplete}>
          <Sparkles size={16} aria-hidden="true" />
          {isUnlocked ? "Unlocked" : "Mark Referred"}
        </AppButton>
      </div>
    </section>
  );
}
