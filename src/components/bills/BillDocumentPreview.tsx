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
    <p className="p-4 text-base text-[#53617a]">
      Preview unavailable.{" "}
      <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-[#08764f] underline">
        Open the bill document
      </a>{" "}
      to view or download it.
    </p>
  );

  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-800">Bill document</p>
          <p className="mt-0.5 text-base text-slate-500">Original bill attachment</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-base font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Open
          <ExternalLink size={13} />
        </a>
      </div>
      <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:min-h-105">
        {isPdf ? (
          <div className="px-6 py-6 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <FileText size={25} />
            </span>
            <p className="mt-3 text-base font-semibold text-slate-800">
              PDF bill document
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-base font-semibold text-white hover:bg-slate-800"
            >
              View document <ExternalLink size={13} />
            </a>
          </div>
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
            className="h-auto max-h-125 w-full object-contain"
          />
        )}
      </div>
    </section>
  );
}
