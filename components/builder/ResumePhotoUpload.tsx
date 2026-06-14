"use client";

import { createClient } from "@/lib/supabase/client";
import { Camera, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ResumePhotoUploadProps = {
  value: string;
  onChange: (url: string) => void;
};

export function ResumePhotoUpload({ value, onChange }: ResumePhotoUploadProps) {
  const params = useParams<{ resumeId?: string }>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const chooseFile = () => inputRef.current?.click();

  const uploadFile = async (file: File) => {
    setError("");
    setStatus("");

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
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      const extension = extensionFor(file);
      const resumeId = params?.resumeId ?? "sample-resume";

      if (!userId) {
        const localUrl = await readAsDataUrl(file);
        onChange(localUrl);
        setStatus("Photo preview added. Sign in to save it to cloud storage.");
        return;
      }

      const path = `${userId}/${resumeId}/profile-photo-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("resume-photos").upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } = supabase.storage.from("resume-photos").getPublicUrl(path);
      onChange(publicData.publicUrl);
      setStatus("Photo uploaded.");
    } catch (uploadError) {
      console.error(uploadError);
      setError("Photo upload failed. Check the storage bucket and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 sm:grid-cols-[96px_1fr]">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
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
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white disabled:opacity-70"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={16} aria-hidden="true" />}
              {value ? "Replace Photo" : "Upload Photo"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => {
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

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
