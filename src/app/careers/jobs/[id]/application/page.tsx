import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, DollarSign, MapPin, TimerReset } from "lucide-react";
import { JobApplicationForm } from "@/components/careers/application-form";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { getJobById, initialJobs } from "@/data/jobs";

export function generateStaticParams() {
  return initialJobs.map((job) => ({ id: job.id }));
}

export default async function JobApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-white from-30% to-[#fbfdfc] text-[#07142d]">
      <Header active="careers" />
      <section className="mx-auto max-w-[1180px] px-5 pt-[42px] pb-10 sm:px-10 lg:px-12">
        <Link
          className="mb-7 inline-flex items-center gap-2 text-[13px] font-bold text-[#00895f]"
          href={`/careers/jobs/${job.id}`}
        >
          <ArrowLeft size={16} /> Back to role overview
        </Link>
        <div className="grid gap-7 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-[13px] border border-[#dfe9e6] bg-white/85 p-5 shadow-[0_7px_28px_#153c3010]">
            <p className="mb-2 text-[11px] font-extrabold text-[#00895f]">
              APPLYING FOR
            </p>
            <h1 className="mb-5 text-[26px] font-bold leading-tight tracking-[-.04em]">
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
          </aside>
          <JobApplicationForm job={job} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
