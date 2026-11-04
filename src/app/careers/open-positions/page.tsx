import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, MapPin, Search, TimerReset } from "lucide-react";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { PositionsFilterForm } from "@/components/careers/positions-filter-form";
import { initialJobs } from "@/data/jobs";

const selectClass =
  "h-11 min-w-0 w-full rounded-[7px] border border-[#d9e4e1] bg-white px-3 text-[16px] font-semibold text-[#53617a] outline-none focus:border-[#009268]";

export default async function OpenPositionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ department?: string; location?: string; type?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const department = resolvedSearchParams?.department || "all";
  const location = resolvedSearchParams?.location || "all";
  const type = resolvedSearchParams?.type || "all";
  const search = resolvedSearchParams?.q || "";
  const searchTerm = search.trim().toLowerCase();

  const departments = Array.from(new Set(initialJobs.map((job) => job.department)));
  const locations = Array.from(new Set(initialJobs.map((job) => job.location)));
  const types = Array.from(new Set(initialJobs.map((job) => job.type)));

  const filteredJobs = initialJobs.filter(
    (job) =>
      (department === "all" || job.department === department) &&
      (location === "all" || job.location === location) &&
      (type === "all" || job.type === type) &&
      [job.title, job.department, job.location, job.type].some((value) =>
        value.toLowerCase().includes(searchTerm),
      ),
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-white from-30% to-[#fbfdfc] text-[#07142d]">
      <Header active="careers" />
      <section className="mx-auto max-w-[1180px] px-5 pt-[60px] pb-8 sm:px-10 lg:px-12">
        <p className="mb-4 text-[14px] font-extrabold text-[#00895f]">
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
        <PositionsFilterForm>
          <div className="mb-4 flex items-center justify-between gap-4 max-[620px]:flex-col max-[620px]:items-start">
            <span className="text-[16px] font-bold text-[#53617a]">Filters</span>
            <span className="text-[16px] font-bold text-[#00895f]">
              Open Positions ({filteredJobs.length})
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 min-[701px]:grid-cols-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
            <div className="flex min-w-0 gap-2 min-[701px]:col-span-3 lg:col-span-1">
              <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-[7px] border border-[#d9e4e1] bg-white px-3 text-[#53617a] focus-within:border-[#009268]">
                <Search size={17} className="shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  name="q"
                  defaultValue={search}
                  aria-label="Search open positions"
                  placeholder="Search roles…"
                  className="min-w-0 flex-1 bg-transparent text-[16px] outline-none"
                />
              </label>
              <button
                type="submit"
                className="h-11 shrink-0 rounded-[7px] bg-[#009268] px-4 text-[15px] font-bold text-white transition hover:bg-[#008455] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009268]"
              >
                Search
              </button>
            </div>
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
        </PositionsFilterForm>

        <section className="mt-8 grid gap-4">
          {filteredJobs.map((job) => (
            <Link
              className="grid grid-cols-[1fr_auto] gap-5 rounded-[13px] border border-[#dfe9e6] bg-white p-5 shadow-[0_7px_24px_#153c3009] transition hover:border-[#9ed7c5] hover:bg-[#f7fcfa] max-[620px]:grid-cols-1"
              href={`/careers/jobs/${job.id}`}
              key={job.id}
            >
              <div>
                <h2 className="text-[18px] font-bold">{job.title}</h2>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold text-[#657386]">
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
              <span className="inline-flex items-center gap-2 self-center text-[16px] font-bold text-[#00895f]">
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
