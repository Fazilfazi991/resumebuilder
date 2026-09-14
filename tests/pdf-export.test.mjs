import assert from "node:assert/strict";
import test from "node:test";
import { jsPDF } from "jspdf";
import {
  RESUME_PDF_A4_HEIGHT_PT,
  RESUME_PDF_WIDTH_PT,
  resumePdfPageConfig,
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
