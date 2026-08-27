import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  DollarSign,
  MapPin,
  TimerReset,
} from "lucide-react";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { getJobById, initialJobs } from "@/data/jobs";

export function generateStaticParams() {
  return initialJobs.map((job) => ({ id: job.id }));
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = getJobById(params.id);

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-white from-30% to-[#fbfdfc] text-[#07142d]">
      <Header active="careers" />
      <section className="mx-auto max-w-[1180px] px-5 pt-[42px] pb-10 sm:px-10 lg:px-12">
        <Link
          className="mb-7 inline-flex items-center gap-2 text-[13px] font-bold text-[#00895f]"
          href="/careers/open-positions"
        >
          <ArrowLeft size={16} /> Back to open positions
        </Link>
        <div className="grid gap-7 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-[13px] border border-[#dfe9e6] bg-white/85 p-5 shadow-[0_7px_28px_#153c3010]">
            <h1 className="mb-5 text-[28px] font-bold leading-tight tracking-[-.04em]">
              {job.title}
            </h1>
            {[
              [MapPin, job.location],
              [BriefcaseBusiness, job.department],
              [TimerReset, job.type],
              [DollarSign, job.salaryExpectations],
            ].map(([Icon, value]) => (
              <div
                className="flex items-center gap-3 border-t border-[#e8eeeb] py-3 text-[14px] font-semibold text-[#596885]"
                key={value as string}
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf9f5] text-[#009268]">
                  <Icon size={16} />
                </span>
                {value as string}
              </div>
            ))}
            <Link
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#009268] px-5 text-[14px] font-bold text-white"
              href={`/careers/jobs/${job.id}/application`}
            >
              Apply now <ArrowRight size={16} />
            </Link>
          </aside>

          <div className="grid gap-4">
            <article className="rounded-[13px] border border-[#dfe9e6] bg-white p-6 shadow-[0_7px_24px_#153c3009]">
              <h2 className="mb-3 text-[18px] font-bold">About Vuior Billpay</h2>
              <p className="text-[15px] leading-7 text-[#657386]">{job.aboutUs}</p>
            </article>
            <article className="rounded-[13px] border border-[#dfe9e6] bg-white p-6 shadow-[0_7px_24px_#153c3009]">
              <h2 className="mb-3 text-[18px] font-bold">Role overview</h2>
              <p className="text-[15px] leading-7 text-[#657386]">{job.summary}</p>
            </article>
            {job.sections.map((section) => (
              <article
                className="rounded-[13px] border border-[#dfe9e6] bg-white p-6 shadow-[0_7px_24px_#153c3009]"
                key={section.title}
              >
                <h2 className="mb-3 text-[18px] font-bold">{section.title}</h2>
                {section.body ? (
                  <p className="text-[15px] leading-7 text-[#657386]">
                    {section.body}
                  </p>
                ) : null}
                {section.items ? (
                  <ul className="grid gap-3 pl-0 text-[15px] leading-7 text-[#657386]">
                    {section.items.map((item) => (
                      <li className="grid grid-cols-[18px_1fr] gap-2" key={item}>
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#009268]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
