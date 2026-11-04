export function isSupportedImageUrl(value) {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value.trim());
    return (url.protocol === "https:" || url.protocol === "http:") && /\.(jpg|jpeg|png)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function normalizeImageUrl(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (!isSupportedImageUrl(trimmed)) {
    throw new Error("Please use a direct image link ending in .jpg, .jpeg or .png.");
  }
  return trimmed;
}
