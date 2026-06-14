export function Watermark({ show }: { show?: boolean }) {
  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
      <span className="-rotate-12 whitespace-nowrap text-[28px] font-bold uppercase tracking-[0.22em] text-slate-300/35">
        Created with ResumeCraft
      </span>
    </div>
  );
}
