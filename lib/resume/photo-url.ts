import type { ResumeData } from "@/types/resume";

const photoRoute = "/api/resume-photo";
const publicStorageMarker = "/storage/v1/object/public/resume-photos/";

export function privatePhotoUrl(path: string) {
  return `${photoRoute}?path=${encodeURIComponent(path)}`;
}

export function photoStoragePathFromUrl(value: string, userId: string) {
  let path = "";
  try {
    if (value.startsWith(photoRoute)) {
      path = new URL(value, "https://www.resumi.live").searchParams.get("path") ?? "";
    } else {
      const url = new URL(value);
      const markerIndex = url.pathname.indexOf(publicStorageMarker);
      if (markerIndex >= 0) path = decodeURIComponent(url.pathname.slice(markerIndex + publicStorageMarker.length));
    }
  } catch {
    return null;
  }

  if (!path || path.includes("\\") || path.split("/").some((part) => part === "..")) return null;
  return path.startsWith(`${userId}/`) ? path : null;
}

export function withPrivatePhotoUrl(resumeData: ResumeData, userId: string): ResumeData {
  const path = photoStoragePathFromUrl(resumeData.personal.photoUrl, userId);
  if (!path) return resumeData;
  return { ...resumeData, personal: { ...resumeData.personal, photoUrl: privatePhotoUrl(path) } };
}
