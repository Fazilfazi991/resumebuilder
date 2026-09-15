import assert from "node:assert/strict";
import test from "node:test";
import { shouldOfferDraftRecovery } from "../lib/resume/draft-recovery.ts";

const cloud = {
  title: "QA Resume",
  templateId: "creative-portfolio",
  resumeData: { personal: { fullName: "Taylor Sample", photoUrl: "" }, summary: "Synthetic QA" },
  sectionOrder: ["summary", "experience"],
};
const updatedAt = "2026-09-15T04:00:00.000Z";

test("a newer local timestamp does not prompt recovery for already-saved contents", () => {
  const draft = { ...structuredClone(cloud), updatedAt: "2026-09-15T04:00:02.000Z" };
  assert.equal(shouldOfferDraftRecovery(draft, cloud, updatedAt), false);
});

test("a newer divergent local draft is offered for recovery", () => {
  const draft = { ...structuredClone(cloud), title: "Unsaved edit", updatedAt: "2026-09-15T04:00:02.000Z" };
  assert.equal(shouldOfferDraftRecovery(draft, cloud, updatedAt), true);
});

test("an older divergent draft does not override a newer cloud resume", () => {
  const draft = { ...structuredClone(cloud), templateId: "modern-minimal", updatedAt: "2026-09-15T03:59:58.000Z" };
  assert.equal(shouldOfferDraftRecovery(draft, cloud, updatedAt), false);
});

test("a divergent draft is offered when no cloud timestamp exists", () => {
  const draft = { ...structuredClone(cloud), resumeData: { ...cloud.resumeData, summary: "Offline edit" }, updatedAt };
  assert.equal(shouldOfferDraftRecovery(draft, cloud), true);
});
