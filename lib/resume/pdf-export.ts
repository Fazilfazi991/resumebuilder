export const RESUME_PDF_CAPTURE_WIDTH_PX = 794;
export const RESUME_PDF_PAGE_HEIGHT_PX = 1123;
export const RESUME_PDF_WIDTH_PT = 595.28;
export const RESUME_PDF_A4_HEIGHT_PT = 841.89;
export const RESUME_PDF_MIN_HEIGHT_PT = 72;

export type ResumePdfPageConfig = {
  orientation: "portrait" | "landscape";
  format: "a4" | [number, number];
  width: number;
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
