import { Check } from "lucide-react";
import { ButtonLink } from "./ButtonLink";

type PricingCardProps = {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
};

export function PricingCard({ name, price, features, featured = false }: PricingCardProps) {
  return (
    <article
      className={`rounded-lg border bg-white p-6 shadow-sm ${
        featured ? "border-teal-600 ring-4 ring-teal-100" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-slate-950">{name}</h3>
        {featured ? <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">Popular</span> : null}
      </div>
      <p className="mt-5 text-3xl font-bold text-slate-950">{price}</p>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-slate-600">
            <Check className="mt-0.5 shrink-0 text-teal-700" size={17} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <ButtonLink href="#builder" variant={featured ? "primary" : "secondary"}>
          Start Building
        </ButtonLink>
      </div>
    </article>
  );
}
