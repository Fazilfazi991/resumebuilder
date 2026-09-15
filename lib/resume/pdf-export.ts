export const RESUME_PDF_CAPTURE_WIDTH_PX = 794;
export const RESUME_PDF_PAGE_HEIGHT_PX = 1123;
export const RESUME_PDF_WIDTH_PT = 595.28;
export const RESUME_PDF_A4_HEIGHT_PT = 841.89;
export const RESUME_PDF_MIN_HEIGHT_PT = 72;
export const RESUME_PDF_PAGE_BREAK_GUARD_PX = 24;
export const RESUME_PDF_MIN_SINGLE_PAGE_SCALE = 0.92;
export const RESUME_PDF_MIN_TAIL_FILL_FRACTION = 0.25;
export const RESUME_PDF_MIN_CURRENT_PAGE_FILL_FRACTION = 0.70;

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
  hasBreakableChildren?: boolean;
};

export type ResumePdfPageSlice = {
  start: number;
  height: number;
};

export function resumePdfSinglePageFitScale(
  captureHeightPx: number,
  pageHeightPx = RESUME_PDF_PAGE_HEIGHT_PX,
): number | null {
  if (!Number.isFinite(captureHeightPx) || !Number.isFinite(pageHeightPx) || captureHeightPx <= 0 || pageHeightPx <= 0) return null;
  if (captureHeightPx <= pageHeightPx) return 1;
  const scale = Math.min(
    pageHeightPx / captureHeightPx,
    RESUME_PDF_A4_HEIGHT_PT / ((captureHeightPx * RESUME_PDF_WIDTH_PT) / RESUME_PDF_CAPTURE_WIDTH_PX),
  );
  return scale >= RESUME_PDF_MIN_SINGLE_PAGE_SCALE ? scale : null;
}

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
    .filter(({ hasBreakableChildren }) => !hasBreakableChildren)
    .filter(({ top, height }) => Number.isFinite(top) && Number.isFinite(height) && top >= 0 && height > 0)
    .filter(({ height }) => height <= pageHeightPx - RESUME_PDF_PAGE_BREAK_GUARD_PX)
    .map((target) => ({ ...target, breakBefore: target.breakBefore ?? target.top }))
    .sort((left, right) => left.top - right.top);
  const slices: ResumePdfPageSlice[] = [];
  let start = 0;
  const isSafeBoundary = (boundary: number) => safeTargets.every(({ top, height }) => top >= boundary || top + height <= boundary);

  while (start < captureHeightPx) {
    const desiredEnd = Math.min(start + pageHeightPx, captureHeightPx);
    let end = desiredEnd;

    if (desiredEnd < captureHeightPx) {
      const crossingTargets = safeTargets
        .filter(({ top, height, breakBefore }) => breakBefore > start + RESUME_PDF_PAGE_BREAK_GUARD_PX && top < desiredEnd && top + height > desiredEnd)
        .sort((left, right) => left.breakBefore - right.breakBefore)
      if (crossingTargets.length) {
        const preferredEnd = crossingTargets[0].breakBefore;
        const safeEnd = safeTargets
          .map(({ breakBefore }) => breakBefore)
          .filter((boundary) => boundary > start + RESUME_PDF_PAGE_BREAK_GUARD_PX && boundary <= preferredEnd && isSafeBoundary(boundary))
          .sort((left, right) => right - left)[0];
        if (safeEnd !== undefined) end = safeEnd;
      }

      if (captureHeightPx - end < pageHeightPx * RESUME_PDF_MIN_TAIL_FILL_FRACTION) {
        const balancingTarget = safeTargets
          .filter(({ top, breakBefore }) =>
            top < end &&
            breakBefore > start + pageHeightPx * RESUME_PDF_MIN_CURRENT_PAGE_FILL_FRACTION &&
            breakBefore < end - RESUME_PDF_PAGE_BREAK_GUARD_PX &&
            isSafeBoundary(breakBefore) &&
            captureHeightPx - breakBefore >= pageHeightPx * RESUME_PDF_MIN_TAIL_FILL_FRACTION,
          )
          .sort((left, right) => left.breakBefore - right.breakBefore)
          .at(-1);
        if (balancingTarget) end = balancingTarget.breakBefore;
      }
    }

    if (end <= start) end = desiredEnd;
    slices.push({ start, height: end - start });
    start = end;
  }

  return slices;
}
