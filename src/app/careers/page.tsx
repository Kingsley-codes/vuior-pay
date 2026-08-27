import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Globe2, TrendingUp, Zap } from "lucide-react";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { initialJobs, whyJoinUs } from "@/data/jobs";

const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2.5 rounded-md bg-linear-to-br from-[#00a475] to-[#007d5a] px-[23px] text-[14px] font-bold text-white shadow-[0_8px_20px_#008e6623] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824]";
const eyebrow =
  "mb-[18px] text-[11px] font-extrabold text-[#00895f] max-[620px]:text-[12px]";

const icons = [Zap, Globe2, TrendingUp, BriefcaseBusiness];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white text-[#07142d]">
      <Header active="careers" />
      <section className="border-b border-[#dfe9e6] bg-linear-to-r from-white via-[#f8fcfa] to-[#e8f7f1]">
        <div className="mx-auto grid max-w-[1330px] grid-cols-[1.1fr_.9fr] items-center gap-10 px-12 py-[70px] max-[900px]:grid-cols-1 max-[900px]:px-[30px] max-[620px]:px-5 max-[620px]:py-[55px] max-[620px]:text-center">
          <div>
            <p className={eyebrow}>CAREERS AT VUIOR</p>
            <h1 className="mb-[22px] text-[43px] font-bold leading-[1.08] tracking-[-1.9px] max-[620px]:text-[34px]">
              Innovate, empower,
              <br />
              and thrive with us.
            </h1>
            <p className="max-w-[560px] text-[14px] leading-[1.65] text-[#58677b] min-[901px]:text-[18px] min-[901px]:leading-[1.7] max-[900px]:mx-auto max-[620px]:text-[15px]">
              Vuior is redefining how people manage and save on their bills. We
              are looking for passionate, practical builders to help shape the
              future of financial wellness.
            </p>
            <div className="mt-7 flex items-center gap-5 max-[900px]:justify-center max-[620px]:flex-col">
              <Link className={primaryButton} href="/careers/open-positions">
                See open positions <ArrowRight size={17} />
              </Link>
              <span className="text-[12px] font-bold text-[#687689] max-[620px]:text-[14px]">
                {initialJobs.length} remote roles open
              </span>
            </div>
          </div>
          <div className="grid gap-3 rounded-[13px] border border-[#dfe9e6] bg-white/85 p-5 shadow-[0_12px_35px_#183c3112] max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[560px]">
            {initialJobs.map((job) => (
              <Link
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[10px] border border-[#e5ecea] p-4 transition hover:border-[#9ed7c5] hover:bg-[#f6fbf9]"
                href={`/careers/jobs/${job.id}`}
                key={job.id}
              >
                <span>
                  <strong className="block text-[14px]">{job.title}</strong>
                  <small className="mt-1 block text-[12px] text-[#667487]">
                    {job.department} / {job.location}
                  </small>
                </span>
                <ArrowRight className="text-[#009268]" size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1330px] px-12 py-[62px] max-[900px]:px-[30px] max-[620px]:px-5">
        <div className="max-w-[640px] max-[620px]:text-center">
          <p className={eyebrow}>WHY WORK HERE</p>
          <h2 className="mb-[17px] text-[30px] font-bold leading-[1.22] tracking-[-0.8px] max-[620px]:text-[28px]">
            Build useful financial tools with people who care.
          </h2>
        </div>
        <div className="mt-[34px] grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          {whyJoinUs.map((item, index) => {
            const Icon = icons[index];
            return (
              <article
                className="rounded-[10px] border border-[#dfe9e6] bg-white px-5 py-5 shadow-[0_7px_24px_#153c3009]"
                key={item.title}
              >
                <span className="mb-4 grid h-[42px] w-[42px] place-items-center rounded-[9px] bg-[#edf9f5] text-[#009268]">
                  <Icon size={21} />
                </span>
                <h3 className="mb-2 text-[13px] max-[620px]:text-[17px]">
                  {item.title}
                </h3>
                <p className="m-0 text-[10px] leading-[1.6] text-[#657386] min-[901px]:text-[14px] max-[620px]:text-[15px]">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mb-8 flex min-h-[120px] max-w-[1330px] items-center justify-between rounded-[13px] border border-[#dfe9e6] bg-[#f4fbf8] px-9 py-6 max-[900px]:mx-[30px] max-[620px]:mx-4 max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-5">
        <div>
          <h2 className="mb-2 text-[20px] font-bold">Be part of our vision.</h2>
          <p className="text-[14px] leading-6 text-[#667487]">
            Join a team focused on community, innovation, and lasting financial
            impact.
          </p>
        </div>
        <Link className={primaryButton} href="/careers/open-positions">
          Explore roles <ArrowRight size={17} />
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
