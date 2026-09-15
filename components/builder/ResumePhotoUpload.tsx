"use client";

import { createClient } from "@/lib/supabase/client";
import { Camera, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { photoStoragePathFromUrl, privatePhotoUrl } from "@/lib/resume/photo-url";
import { uploadAndCommitResumePhoto } from "@/lib/resume/photo-upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ResumePhotoUploadProps = {
  value: string;
  onChange: (url: string) => void;
  disabledReason?: string;
  onAuthRequired?: () => void;
  enableCloudUpload?: boolean;
};

export function ResumePhotoUpload({ value, onChange, disabledReason, onAuthRequired, enableCloudUpload = true }: ResumePhotoUploadProps) {
  const params = useParams<{ resumeId?: string }>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const chooseFile = () => {
    if (disabledReason) {
      onAuthRequired?.();
      return;
    }
    inputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    setError("");
    setStatus("");
    setPreviewUrl("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Photo must be 5MB or smaller.");
      return;
    }

    setIsUploading(true);
    try {
      const localUrl = await readAsOptimizedDataUrl(file);
      setPreviewUrl(localUrl);

      if (!enableCloudUpload) {
        onChange(localUrl);
        setStatus("Photo added to preview.");
        return;
      }

      setStatus("Uploading photo to cloud storage...");

      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      const extension = extensionFor(file);
      const resumeId = params?.resumeId ?? "sample-resume";

      if (!userId) {
        setError("Sign in to save a photo. Your resume was not changed.");
        return;
      }

      const path = `${userId}/${resumeId}/profile-photo-${crypto.randomUUID()}.${extension}`;
      // Only a short storage URL enters the resume's autosave payload after upload.
      await uploadAndCommitResumePhoto(supabase.storage.from("resume-photos"), path, file, privatePhotoUrl, onChange);
      setStatus("Photo uploaded to cloud storage. The resume will autosave next.");
    } catch (uploadError) {
      console.error(uploadError);
      setStatus("");
      setError("Photo could not be saved. Your resume is unchanged; please try again.");
    } finally {
      setPreviewUrl("");
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 sm:grid-cols-[88px_1fr]">
        <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white sm:h-24 sm:w-24">
          {previewUrl || value ? (
            <img src={previewUrl || value} alt="" className="h-full w-full object-cover" />
          ) : (
            <Camera size={28} className="text-slate-400" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={chooseFile}
              disabled={isUploading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-70"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={16} aria-hidden="true" />}
              {value ? "Replace Photo" : "Upload Photo"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm("Remove this photo from the resume and cloud storage?")) return;
                  if (enableCloudUpload) {
                    const supabase = createClient();
                    const { data: userData } = await supabase.auth.getUser();
                    const userId = userData.user?.id;
                    const path = userId ? photoStoragePathFromUrl(value, userId) : null;
                    if (path) await supabase.storage.from("resume-photos").remove([path]);
                  }
                  onChange("");
                  setStatus("Photo removed.");
                  setError("");
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-rose-100 bg-white px-4 text-sm font-bold text-rose-700"
              >
                <Trash2 size={16} aria-hidden="true" />
                Remove
              </button>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-5 text-slate-600">JPG, PNG, or WEBP. Maximum 5MB.</p>
          {disabledReason ? <p className="mt-2 text-sm font-semibold text-blue-700">{disabledReason}</p> : null}
          {status ? <p className="mt-2 text-sm font-semibold text-emerald-700">{status}</p> : null}
          {error ? <p className="mt-2 text-sm font-semibold text-rose-700">{error}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void uploadFile(file);
        }}
      />
    </section>
  );
}

function extensionFor(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function readAsOptimizedDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const maxDimension = 1200;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Photo preview could not be prepared."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.86));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Photo could not be read."));
    };
    image.src = objectUrl;
  });
}
