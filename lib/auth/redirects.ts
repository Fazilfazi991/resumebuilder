export function safeRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback = "/dashboard") {
  const path = typeof value === "string" && value.trim() ? value.trim() : fallback;
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

export function loginPathFor(next: string) {
  return `/login?next=${encodeURIComponent(safeRedirectPath(next))}`;
}
