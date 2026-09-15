import assert from "node:assert/strict";
import test from "node:test";
import { jsPDF } from "jspdf";
import {
  RESUME_PDF_A4_HEIGHT_PT,
  RESUME_PDF_PAGE_HEIGHT_PX,
  RESUME_PDF_WIDTH_PT,
  resumePdfPageSlices,
  resumePdfPageConfig,
  resumePdfSinglePageFitScale,
} from "../lib/resume/pdf-export.ts";

const withinPointTolerance = (actual, expected) => Math.abs(actual - expected) < 0.02;

test("standard resume exports retain A4 portrait geometry", () => {
  const config = resumePdfPageConfig(1123, false);
  const pdf = new jsPDF({ unit: "pt", format: config.format, orientation: config.orientation });

  assert.equal(config.orientation, "portrait");
  assert.equal(config.format, "a4");
  assert.ok(withinPointTolerance(pdf.internal.pageSize.getWidth(), RESUME_PDF_WIDTH_PT));
  assert.ok(withinPointTolerance(pdf.internal.pageSize.getHeight(), RESUME_PDF_A4_HEIGHT_PT));
});

test("compact auto-fit exports preserve resume width instead of clipping it", () => {
  const config = resumePdfPageConfig(676, true);
  const pdf = new jsPDF({ unit: "pt", format: config.format, orientation: config.orientation });

  assert.equal(config.orientation, "landscape");
  assert.ok(config.height < config.width);
  assert.ok(withinPointTolerance(pdf.internal.pageSize.getWidth(), RESUME_PDF_WIDTH_PT));
  assert.ok(withinPointTolerance(pdf.internal.pageSize.getHeight(), config.height));
});

test("taller auto-fit exports keep portrait orientation and fixed resume width", () => {
  const config = resumePdfPageConfig(900, true);
  const pdf = new jsPDF({ unit: "pt", format: config.format, orientation: config.orientation });

  assert.equal(config.orientation, "portrait");
  assert.ok(config.height > config.width);
  assert.ok(withinPointTolerance(pdf.internal.pageSize.getWidth(), RESUME_PDF_WIDTH_PT));
  assert.ok(withinPointTolerance(pdf.internal.pageSize.getHeight(), config.height));
});

test("slightly overflowing A4 content fits one page without distortion", () => {
  const scale = resumePdfSinglePageFitScale(1200);
  assert.ok(scale !== null);
  assert.ok(scale >= 0.92 && scale < 1);
  const pageWidth = RESUME_PDF_WIDTH_PT * scale;
  const pageHeight = (1200 * pageWidth) / 794;
  assert.ok(pageWidth < RESUME_PDF_WIDTH_PT);
  assert.ok(pageHeight <= RESUME_PDF_A4_HEIGHT_PT);
});

test("substantial overflow stays at full-size A4 pagination", () => {
  assert.equal(resumePdfSinglePageFitScale(1300), null);
  assert.equal(resumePdfSinglePageFitScale(1123), 1);
});

test("A4 pagination cuts before a short element that would straddle a boundary", () => {
  assert.deepEqual(resumePdfPageSlices(1600, RESUME_PDF_PAGE_HEIGHT_PX, [{ top: 1050, height: 180 }]), [
    { start: 0, height: 1050 },
    { start: 1050, height: 550 },
  ]);
});

test("A4 pagination keeps normal boundaries for fitting or oversized content", () => {
  assert.deepEqual(resumePdfPageSlices(1600, RESUME_PDF_PAGE_HEIGHT_PX, [
    { top: 900, height: 200 },
    { top: 950, height: RESUME_PDF_PAGE_HEIGHT_PX },
  ]), [
    { start: 0, height: RESUME_PDF_PAGE_HEIGHT_PX },
    { start: RESUME_PDF_PAGE_HEIGHT_PX, height: 477 },
  ]);
});

test("A4 pagination prefers the latest nested boundary before the cut", () => {
  assert.deepEqual(resumePdfPageSlices(1600, RESUME_PDF_PAGE_HEIGHT_PX, [
    { top: 700, height: 600, hasBreakableChildren: true },
    { top: 1040, height: 180 },
  ])[0], { start: 0, height: 1040 });
});

test("A4 pagination protects items crossing the break in both columns", () => {
  assert.deepEqual(resumePdfPageSlices(1600, RESUME_PDF_PAGE_HEIGHT_PX, [
    { top: 900, height: 300 },
    { top: 1050, height: 180 },
  ])[0], { start: 0, height: 900 });
});

test("A4 pagination does not move a boundary inside another item", () => {
  assert.deepEqual(resumePdfPageSlices(1600, RESUME_PDF_PAGE_HEIGHT_PX, [
    { top: 700, height: 170 },
    { top: 820, height: 380 },
  ])[0], { start: 0, height: 700 });
});

test("A4 pagination carries a nearby section heading with its first item", () => {
  assert.deepEqual(resumePdfPageSlices(1600, RESUME_PDF_PAGE_HEIGHT_PX, [
    { top: 1040, height: 180, breakBefore: 995 },
  ])[0], { start: 0, height: 995 });
});

test("a tiny second page pulls a complete nearby item across the break", () => {
  assert.deepEqual(resumePdfPageSlices(1300, RESUME_PDF_PAGE_HEIGHT_PX, [
    { top: 820, height: 130 },
    { top: 980, height: 110 },
  ]), [
    { start: 0, height: 980 },
    { start: 980, height: 320 },
  ]);
});

test("normal second pages keep the original A4 boundary", () => {
  assert.deepEqual(resumePdfPageSlices(1600, RESUME_PDF_PAGE_HEIGHT_PX, [
    { top: 980, height: 110 },
  ])[0], { start: 0, height: RESUME_PDF_PAGE_HEIGHT_PX });
});
