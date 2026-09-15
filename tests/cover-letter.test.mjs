import assert from "node:assert/strict";
import test from "node:test";
import { generateCoverLetter } from "../lib/cover-letter/generate-cover-letter.ts";

const resumeData = {
  personal: { fullName: "Alex Morgan", jobTitle: "Product Manager" },
  summary: "Product leader focused on customer outcomes.",
  experience: [
    { role: "Senior Product Manager", company: "Northstar", description: "launching products that improved activation", bullets: [] },
  ],
  education: [],
  skills: [
    { name: "Product strategy" },
    { name: "Analytics" },
  ],
  projects: [
    { name: "Activation redesign", description: "I led discovery and delivery.", bullets: [] },
  ],
};

test("cover-letter drafts personalize the role, company, experience, and closing", () => {
  const letter = generateCoverLetter({
    resumeData,
    companyName: "Acme",
    hiringManagerName: "Jordan Lee",
    targetJobTitle: "Lead Product Manager",
    tone: "Professional",
    length: "Standard",
  });

  assert.match(letter, /^Dear Jordan Lee,/);
  assert.match(letter, /Lead Product Manager position at Acme/);
  assert.match(letter, /Senior Product Manager at Northstar/);
  assert.match(letter, /Activation redesign/);
  assert.match(letter, /Sincerely,\nAlex Morgan$/);
});

test("short drafts omit extended experience and detailed closing paragraphs", () => {
  const letter = generateCoverLetter({
    resumeData,
    companyName: "Acme",
    targetJobTitle: "Product Manager",
    tone: "Friendly",
    length: "Short",
  });

  assert.doesNotMatch(letter, /In my recent work/);
  assert.doesNotMatch(letter, /support your team’s priorities/);
});

test("sparse resume data produces complete prose without empty placeholders", () => {
  const sparseData = {
    ...resumeData,
    personal: { fullName: "", jobTitle: "" },
    summary: "",
    experience: [{ role: "", company: "", description: "", bullets: [""] }],
    skills: [{ name: "" }],
    projects: [{ name: "Portfolio refresh", description: "", bullets: [] }],
  };
  const letter = generateCoverLetter({
    resumeData: sparseData,
    companyName: "",
    targetJobTitle: "",
    tone: "Confident",
    length: "Standard",
  });

  assert.match(letter, /Portfolio refresh, strengthening my planning, execution, and collaboration\./);
  assert.doesNotMatch(letter, / at \./);
  assert.doesNotMatch(letter, /where\s*[.\n]/);
  assert.doesNotMatch(letter, /undefined|null/);
});
