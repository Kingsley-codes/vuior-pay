export function isPdfDocument(
  url?: string,
  documentType?: string,
  documentName?: string,
) {
  const mimeType = documentType?.split(";")[0].trim().toLowerCase();
  if (mimeType === "application/pdf" || mimeType === "pdf") return true;
  if (mimeType?.startsWith("image/")) return false;
  if (documentName?.trim().toLowerCase().endsWith(".pdf")) return true;
  if (!url) return false;
  if (/^data:application\/pdf[;,]/i.test(url)) return true;

  let pathname: string;
  try {
    pathname = new URL(url, "https://preview.local").pathname;
  } catch {
    pathname = url.split(/[?#]/)[0];
  }
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // A malformed escape should not prevent checking the file extension.
  }
  return pathname.toLowerCase().endsWith(".pdf");
}
