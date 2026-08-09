"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  FileText,
  Headphones,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { FAQ_CATEGORIES, MOBILE_FAQS, type FAQCategory } from "@/data/faqs";

type Topic = "All Topics" | FAQCategory;
const topics: Topic[] = ["All Topics", ...FAQ_CATEGORIES];

export default function HelpPage() {
  const [topic, setTopic] = useState<Topic>("All Topics");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(MOBILE_FAQS[0]?.value || "");
  const filtered = useMemo(
    () =>
      MOBILE_FAQS.filter(
        (faq) =>
          (topic === "All Topics" || faq.category === topic) &&
          `${faq.title} ${faq.content}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [topic, search],
  );

  return (
    <div className="inner-page bg-white">
      <Header active="faq" />
      <section className="relative overflow-hidden border-b border-[#edf1ef] bg-linear-to-r from-white via-white to-[#f0faf6] px-5 py-10 sm:px-10 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-[12px] font-semibold text-[#009b67]">FAQ</p>
          <h1 className="mt-3 text-[34px] font-bold tracking-[-.04em] sm:text-[38px]">
            Frequently asked questions
          </h1>
          <p className="mt-4 max-w-[500px] text-[14px] leading-7 text-[#596885]">
            Everything you need to know about accounts, bills, payments,
            credits, referrals, and security.
          </p>
          <label className="mt-8 flex h-12 max-w-[590px] items-center gap-3 rounded-lg border border-[#dfe6e4] bg-white px-4 shadow-[0_8px_24px_rgba(25,55,47,.05)]">
            <Search size={18} className="text-[#63728d]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
              placeholder="Search for answers…"
            />
          </label>
        </div>
      </section>
      <main className="mx-auto max-w-[1180px] px-5 py-10 sm:px-10 lg:px-12">
        <div className="flex flex-wrap gap-2">
          {topics.map((item) => (
            <button
              key={item}
              onClick={() => setTopic(item)}
              className={`rounded-full border px-4 py-2 text-[12px] font-semibold transition ${topic === item ? "border-[#009b67] bg-[#009b67] text-white" : "border-[#dfe6e4] bg-white text-[#53617a] hover:border-[#9ed7c5]"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-8 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_290px]">
          <section className="overflow-hidden rounded-xl border border-[#e1e8e5] bg-white shadow-[0_8px_26px_rgba(25,55,47,.04)]">
            {filtered.map((faq) => (
              <article
                key={faq.value}
                className="border-b border-[#e8eeeb] last:border-0"
              >
                <button
                  onClick={() =>
                    setOpen((current) =>
                      current === faq.value ? "" : faq.value,
                    )
                  }
                  className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eef8f4] text-[#009b67]">
                    {faq.category === "Uploading Bills" ? (
                      <FileText size={17} />
                    ) : faq.category === "Account Setup" ? (
                      <ShieldCheck size={17} />
                    ) : faq.category === "Credit Earned" ? (
                      <Sparkles size={17} />
                    ) : (
                      <CircleHelp size={17} />
                    )}
                  </span>
                  <span className="flex-1 text-[14px] font-semibold text-[#172445]">
                    {faq.title}
                  </span>
                  <ChevronDown
                    size={17}
                    className={`text-[#7c899c] transition ${open === faq.value ? "rotate-180" : ""}`}
                  />
                </button>
                {open === faq.value ? (
                  <div className="px-5 pb-5 pl-[76px] sm:px-6 sm:pb-6 sm:pl-[84px]">
                    <p className="whitespace-pre-line text-[13px] leading-6 text-[#65728a]">
                      {faq.content}
                    </p>
                    <span className="mt-3 inline-block rounded bg-[#f2f6f4] px-2 py-1 text-[10px] font-semibold text-[#527064]">
                      {faq.category}
                    </span>
                  </div>
                ) : null}
              </article>
            ))}
            {!filtered.length ? (
              <div className="grid min-h-64 place-items-center p-8 text-center">
                <div>
                  <Search className="mx-auto text-[#b6c4bf]" size={30} />
                  <h2 className="mt-3 text-[14px] font-semibold">
                    No answers found
                  </h2>
                  <p className="mt-1 text-[12px] text-[#718097]">
                    Try a different search or topic.
                  </p>
                </div>
              </div>
            ) : null}
          </section>
          <aside className="rounded-xl border border-[#d6ebe3] bg-[#f4fbf8] p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#009b67] shadow-sm">
              <Headphones size={22} />
            </span>
            <h2 className="mt-4 text-[15px] font-bold">Still need help?</h2>
            <p className="mt-2 text-[12px] leading-6 text-[#66738b]">
              Our support team is available Monday–Friday, 9am–6pm EST.
            </p>
            <Link
              href="/contact"
              className="mt-5 flex h-11 items-center justify-center rounded-md bg-[#009b67] px-5 text-[12px] font-semibold text-white"
            >
              Contact support
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
