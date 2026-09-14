export function safeRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback = "/dashboard") {
  const path = typeof value === "string" && value.trim() ? value.trim() : fallback;
  if (!path.startsWith("/") || path.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(path) || /%5c/i.test(path)) {
    return fallback;
  }

  try {
    const base = new URL("https://redirect-check.resumi.invalid");
    const target = new URL(path, base);
    return target.origin === base.origin ? `${target.pathname}${target.search}${target.hash}` : fallback;
  } catch {
    return fallback;
  }
}

export function loginPathFor(next: string) {
  return `/login?next=${encodeURIComponent(safeRedirectPath(next))}`;
}
