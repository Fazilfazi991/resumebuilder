import assert from "node:assert/strict";
import test from "node:test";
import { emptyResumeData } from "../lib/resume/mock-data.ts";
import { privatePhotoUrl } from "../lib/resume/photo-url.ts";
import { uploadAndCommitResumePhoto } from "../lib/resume/photo-upload.ts";
import { resumeDataSchema } from "../lib/validations/resume.ts";

test("authenticated resume data accepts a short uploaded photo URL", () => {
  const photoUrl = privatePhotoUrl("synthetic-user/synthetic-resume/profile-photo-test.png");
  const resume = {
    ...emptyResumeData,
    personal: { ...emptyResumeData.personal, photoUrl },
  };
  assert.equal(resumeDataSchema.safeParse(resume).success, true);
});

test("authenticated resume data rejects an inline photo payload", () => {
  const photoUrl = `data:image/jpeg;base64,${"A".repeat(1200)}`;
  const resume = {
    ...emptyResumeData,
    personal: { ...emptyResumeData.personal, photoUrl },
  };
  assert.equal(resumeDataSchema.safeParse(resume).success, false);
});

test("a pending cloud upload does not enter the resume autosave payload", async () => {
  let finishUpload;
  const storage = { upload: () => new Promise((resolve) => { finishUpload = resolve; }) };
  const changes = [];
  const file = new File(["synthetic image bytes"], "photo.png", { type: "image/png" });
  const path = "synthetic-user/synthetic-resume/profile-photo-test.png";
  const task = uploadAndCommitResumePhoto(storage, path, file, privatePhotoUrl, (url) => changes.push(url));

  assert.deepEqual(changes, []);
  finishUpload({ error: null });
  assert.equal(await task, privatePhotoUrl(path));
  assert.deepEqual(changes, [privatePhotoUrl(path)]);
});

test("a failed cloud upload leaves the saved photo URL unchanged", async () => {
  const storage = { upload: async () => ({ error: new Error("Storage unavailable") }) };
  const file = new File(["synthetic image bytes"], "photo.png", { type: "image/png" });
  const changes = [];
  await assert.rejects(
    uploadAndCommitResumePhoto(storage, "synthetic-user/synthetic-resume/photo.png", file, privatePhotoUrl, (url) => changes.push(url)),
    /Storage unavailable/,
  );
  assert.deepEqual(changes, []);
});
