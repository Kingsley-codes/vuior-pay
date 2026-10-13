"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";
import { isPdfDocument } from "@/utils/billDocument";

export { isPdfDocument } from "@/utils/billDocument";

export default function BillDocumentPreview({
  url,
  documentType,
  documentName,
}: {
  url: string;
  documentType?: string;
  documentName?: string;
}) {
  const isPdf = isPdfDocument(url, documentType, documentName);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const fallback = (
    <p className="p-4 text-[12px] text-[#53617a]">
      Preview unavailable.{" "}
      <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-[#08764f] underline">
        Open the bill document
      </a>{" "}
      to view or download it.
    </p>
  );

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
        <object
          title="Bill document PDF preview"
          data={url}
          type="application/pdf"
          className="h-[min(60vh,520px)] w-full bg-white"
        >
          {fallback}
        </object>
      ) : failedUrl === url ? (
        fallback
      ) : (
        <Image
          src={url}
          alt="Attached bill document"
          width={1200}
          height={800}
          unoptimized
          onError={() => setFailedUrl(url)}
          className="h-auto max-h-130 w-full bg-white object-contain"
        />
      )}
    </section>
  );
}
