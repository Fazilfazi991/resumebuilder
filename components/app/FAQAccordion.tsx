type FAQItem = {
  question: string;
  answer: string;
};

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.question} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <summary className="cursor-pointer list-none text-base font-bold text-slate-950 marker:hidden">
            <span className="flex items-center justify-between gap-4">
              {item.question}
              <span className="text-xl text-teal-700 group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
