import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, MapPin, TimerReset } from "lucide-react";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { initialJobs } from "@/data/jobs";

const selectClass =
  "h-11 rounded-[7px] border border-[#d9e4e1] bg-white px-3 text-[14px] font-semibold text-[#53617a] outline-none focus:border-[#009268]";

export default async function OpenPositionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ department?: string; location?: string; type?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const department = resolvedSearchParams?.department || "all";
  const location = resolvedSearchParams?.location || "all";
  const type = resolvedSearchParams?.type || "all";

  const departments = Array.from(new Set(initialJobs.map((job) => job.department)));
  const locations = Array.from(new Set(initialJobs.map((job) => job.location)));
  const types = Array.from(new Set(initialJobs.map((job) => job.type)));

  const filteredJobs = initialJobs.filter(
    (job) =>
      (department === "all" || job.department === department) &&
      (location === "all" || job.location === location) &&
      (type === "all" || job.type === type),
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-white from-30% to-[#fbfdfc] text-[#07142d]">
      <Header active="careers" />
      <section className="mx-auto max-w-[1180px] px-5 pt-[60px] pb-8 sm:px-10 lg:px-12">
        <p className="mb-4 text-[12px] font-extrabold text-[#00895f]">
          OPEN POSITIONS
        </p>
        <h1 className="text-[38px] font-bold leading-[1.08] tracking-[-1.7px] max-[620px]:text-[34px]">
          Find your place at Vuior.
        </h1>
        <p className="mt-4 max-w-[560px] text-[16px] leading-7 text-[#596885]">
          Explore remote roles across finance, growth, and leadership.
        </p>
      </section>

      <main className="mx-auto max-w-[1180px] px-5 pb-12 sm:px-10 lg:px-12">
        <form className="rounded-[13px] border border-[#dfe9e6] bg-white/85 p-5 shadow-[0_7px_28px_#153c3010]">
          <div className="mb-4 flex items-center justify-between gap-4 max-[620px]:flex-col max-[620px]:items-start">
            <span className="text-[14px] font-bold text-[#53617a]">Filters</span>
            <span className="text-[14px] font-bold text-[#00895f]">
              Open Positions ({filteredJobs.length})
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 max-[700px]:grid-cols-1">
            <select className={selectClass} defaultValue={department} name="department">
              <option value="all">All departments</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select className={selectClass} defaultValue={location} name="location">
              <option value="all">All locations</option>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select className={selectClass} defaultValue={type} name="type">
              <option value="all">All types</option>
              {types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button className="mt-4 h-10 rounded-md bg-[#009268] px-5 text-[13px] font-bold text-white">
            Apply filters
          </button>
        </form>

        <section className="mt-8 grid gap-4">
          {filteredJobs.map((job) => (
            <Link
              className="grid grid-cols-[1fr_auto] gap-5 rounded-[13px] border border-[#dfe9e6] bg-white p-5 shadow-[0_7px_24px_#153c3009] transition hover:border-[#9ed7c5] hover:bg-[#f7fcfa] max-[620px]:grid-cols-1"
              href={`/careers/jobs/${job.id}`}
              key={job.id}
            >
              <div>
                <h2 className="text-[18px] font-bold">{job.title}</h2>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-[#657386]">
                  <span className="inline-flex items-center gap-1.5">
                    <BriefcaseBusiness size={15} /> {job.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} /> {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <TimerReset size={15} /> {job.type}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 self-center text-[14px] font-bold text-[#00895f]">
                View role <ArrowRight size={17} />
              </span>
            </Link>
          ))}
          {!filteredJobs.length ? (
            <div className="rounded-[13px] border border-[#dfe9e6] bg-white p-8 text-center text-[#657386]">
              No roles match those filters.
            </div>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </main>
  );
}
