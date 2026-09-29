import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";

export function isPdfDocument(url?: string, documentType?: string) {
  if (documentType) return documentType.toLowerCase() === "application/pdf";
  if (!url) return false;
  try {
    return decodeURIComponent(new URL(url).pathname)
      .toLowerCase()
      .endsWith(".pdf");
  } catch {
    return url.toLowerCase().split(/[?#]/)[0].endsWith(".pdf");
  }
}

export default function BillDocumentPreview({
  url,
  documentType,
}: {
  url: string;
  documentType?: string;
}) {
  const isPdf = isPdfDocument(url, documentType);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-[#dce9e4] bg-[#f8fbf9]">
      <div className="flex items-center justify-between gap-3 border-b border-[#e4ede8] px-4 py-3">
        <span className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-[#344260]">
          {isPdf ? <FileText size={16} /> : null}
          {isPdf ? "PDF bill document" : "Bill document"}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#08764f] hover:underline"
        >
          Open
          <ExternalLink size={14} />
        </a>
      </div>
      {isPdf ? (
        <iframe
          title="Bill document PDF preview"
          src={url}
          className="h-[min(60vh,520px)] w-full bg-white"
        />
      ) : (
        <Image
          src={url}
          alt="Attached bill document"
          width={1200}
          height={800}
          unoptimized
          className="h-auto max-h-130 w-full bg-white object-contain"
        />
      )}
    </section>
  );
}
