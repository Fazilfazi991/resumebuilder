export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>ResumeCraft helps job seekers create polished resumes faster.</p>
        <div className="flex gap-5">
          <a className="transition hover:text-slate-950" href="#templates">
            Templates
          </a>
          <a className="transition hover:text-slate-950" href="#pricing">
            Pricing
          </a>
          <a className="transition hover:text-slate-950" href="#ai-tools">
            AI Tools
          </a>
        </div>
      </div>
    </footer>
  );
}
