<<<<<<< HEAD
const SUPPORTED_IMAGE_EXTENSIONS = /\.(?:jpe?g|png|gif|webp)$/i;

export function isSupportedImageUrl(value) {
  if (!value || typeof value !== "string") return false;

  try {
    const url = new URL(value.trim());
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      SUPPORTED_IMAGE_EXTENSIONS.test(url.pathname)
    );
=======
export function isSupportedImageUrl(value) {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value.trim());
    return (url.protocol === "https:" || url.protocol === "http:") && /\.(jpg|jpeg|png)$/i.test(url.pathname);
>>>>>>> 5d050b94f5e6a0cde40183f9a3973b17b4bc73e2
  } catch {
    return false;
  }
}

export function normalizeImageUrl(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
<<<<<<< HEAD

  if (!isSupportedImageUrl(trimmed)) {
    throw new Error(
      "Please use a direct image link ending in .jpg, .jpeg, .png, .gif or .webp."
    );
  }

=======
  if (!isSupportedImageUrl(trimmed)) {
    throw new Error("Please use a direct image link ending in .jpg, .jpeg or .png.");
  }
>>>>>>> 5d050b94f5e6a0cde40183f9a3973b17b4bc73e2
  return trimmed;
}
