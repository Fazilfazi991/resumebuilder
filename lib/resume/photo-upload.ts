type PhotoStorage = {
  upload: (
    path: string,
    file: File,
    options: { cacheControl: string; contentType: string },
  ) => Promise<{ error: Error | null }>;
};

export async function uploadAndCommitResumePhoto(
  storage: PhotoStorage,
  path: string,
  file: File,
  photoUrlForPath: (path: string) => string,
  onChange: (url: string) => void,
) {
  const { error } = await storage.upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
  });
  if (error) throw error;

  const url = photoUrlForPath(path);
  onChange(url);
  return url;
}
