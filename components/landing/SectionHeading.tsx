type SectionHeadingProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-7 text-slate-600">{subtitle}</p> : null}
    </div>
  );
}
