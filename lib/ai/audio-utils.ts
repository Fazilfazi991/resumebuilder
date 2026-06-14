// TODO: Normalize recorded audio before upload when transcription is enabled.
// TODO: Add language hints for Malayalam, Hindi, English, and Arabic.

export function audioBlobToFile(blob: Blob, filename = "resume-recording.webm") {
  return new File([blob], filename, { type: blob.type || "audio/webm" });
}
