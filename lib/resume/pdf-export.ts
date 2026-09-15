export const RESUME_PDF_CAPTURE_WIDTH_PX = 794;
export const RESUME_PDF_PAGE_HEIGHT_PX = 1123;
export const RESUME_PDF_WIDTH_PT = 595.28;
export const RESUME_PDF_A4_HEIGHT_PT = 841.89;
export const RESUME_PDF_MIN_HEIGHT_PT = 72;
export const RESUME_PDF_PAGE_BREAK_GUARD_PX = 24;

export type ResumePdfPageConfig = {
  orientation: "portrait" | "landscape";
  format: "a4" | [number, number];
  width: number;
  height: number;
};

export type ResumePdfBreakTarget = {
  top: number;
  height: number;
  breakBefore?: number;
};

export type ResumePdfPageSlice = {
  start: number;
  height: number;
};

export function resumePdfPageConfig(captureHeightPx: number, autoHeight: boolean): ResumePdfPageConfig {
  if (!autoHeight) {
    return {
      orientation: "portrait",
      format: "a4",
      width: RESUME_PDF_WIDTH_PT,
      height: RESUME_PDF_A4_HEIGHT_PT,
    };
  }

  const height = Math.max(
    RESUME_PDF_MIN_HEIGHT_PT,
    (captureHeightPx * RESUME_PDF_WIDTH_PT) / RESUME_PDF_CAPTURE_WIDTH_PX,
  );

  return {
    // jsPDF swaps custom dimensions to enforce the requested orientation. A
    // compact auto-height page can be wider than it is tall, so it must use
    // landscape orientation to preserve the fixed resume width.
    orientation: height < RESUME_PDF_WIDTH_PT ? "landscape" : "portrait",
    format: [RESUME_PDF_WIDTH_PT, height],
    width: RESUME_PDF_WIDTH_PT,
    height,
  };
}

export function resumePdfPageSlices(
  captureHeightPx: number,
  pageHeightPx = RESUME_PDF_PAGE_HEIGHT_PX,
  targets: ResumePdfBreakTarget[] = [],
): ResumePdfPageSlice[] {
  if (!Number.isFinite(captureHeightPx) || !Number.isFinite(pageHeightPx)) return [];
  if (captureHeightPx <= 0 || pageHeightPx <= 0) return [];

  const safeTargets = targets
    .filter(({ top, height }) => Number.isFinite(top) && Number.isFinite(height) && top >= 0 && height > 0)
    .filter(({ height }) => height <= pageHeightPx - RESUME_PDF_PAGE_BREAK_GUARD_PX)
    .map((target) => ({ ...target, breakBefore: target.breakBefore ?? target.top }))
    .sort((left, right) => left.top - right.top);
  const slices: ResumePdfPageSlice[] = [];
  let start = 0;

  while (start < captureHeightPx) {
    const desiredEnd = Math.min(start + pageHeightPx, captureHeightPx);
    let end = desiredEnd;

    if (desiredEnd < captureHeightPx) {
      const crossingTarget = safeTargets
        .filter(({ top, height, breakBefore }) => breakBefore > start + RESUME_PDF_PAGE_BREAK_GUARD_PX && top < desiredEnd && top + height > desiredEnd)
        .sort((left, right) => left.breakBefore - right.breakBefore)
        .at(-1);
      if (crossingTarget) end = crossingTarget.breakBefore;
    }

    if (end <= start) end = desiredEnd;
    slices.push({ start, height: end - start });
    start = end;
  }

  return slices;
}
