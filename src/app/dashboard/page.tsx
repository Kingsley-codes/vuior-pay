import Image from "next/image";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  FileText,
  Home,
  Landmark,
  Moon,
  Search,
  Settings,
  Share2,
  Sun,
  TrendingDown,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "Users", icon: Users },
  { label: "Transactions", icon: Share2, active: true },
  { label: "Analytics", icon: BarChart3 },
  { label: "Promo Codes", icon: FileText },
  { label: "Referrals", icon: Users },
  { label: "Knowledgebase", icon: FileText },
  { label: "Settings", icon: Settings },
];

const summaryCards = [
  {
    title: "Total Transactions",
    value: "12,481",
    delta: "18.6% vs yesterday",
    tone: "green",
    icon: WalletCards,
    chart: "M2 22 C18 19 22 17 35 15 S53 5 64 8 78 2 92 10 104 0",
  },
  {
    title: "Failed Transactions",
    value: "17",
    delta: "5.6% vs yesterday",
    tone: "rose",
    icon: TrendingDown,
    chart: "M2 20 C15 10 22 15 35 9 S52 0 64 8 78 16 91 3 104 13",
  },
  {
    title: "Success Rate",
    value: "98.4%",
    delta: "1.2% vs yesterday",
    tone: "violet",
    icon: TrendingUp,
    chart: "M2 24 C18 22 24 18 36 20 S54 13 66 16 80 8 92 10 104 2",
  },
];

const transactions = [
  ["TXN-12485", "Stanley Agbam", "Electricity", "Duke Energy", "$85.50", "Bank Transfer", "Success", "Jun 23, 2026 10:45 AM"],
  ["TXN-12484", "Alice Johnson", "Mobile Top-up", "T-Mobile", "$20.00", "Card **** 4242", "Success", "Jun 23, 2026 10:30 AM"],
  ["TXN-12483", "Robert Smith", "Internet", "Comcast", "$55.00", "Bank Transfer", "Failed", "Jun 23, 2026 09:15 AM"],
  ["TXN-12482", "Linda Martinez", "Water Bill", "Aqua Water", "$31.20", "Card **** 1111", "Success", "Jun 23, 2026 08:50 AM"],
  ["TXN-12481", "James Anderson", "Cable TV", "Spectrum", "$60.00", "Wallet Balance", "Success", "Jun 23, 2026 08:20 AM"],
];

const chartPoints = [
  438, 438, 528, 574, 404, 412, 366, 480, 520, 368, 384, 512, 426, 480, 624,
  560, 480, 506, 586, 624, 520, 520, 574,
];

function linePath() {
  return chartPoints
    .map((point, index) => {
      const x = 24 + index * 39;
      const y = 218 - (point / 1000) * 180;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#fbfcfd] text-[#07142d] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden border-r border-[#e5e9f0] bg-white px-5 py-8 lg:flex lg:min-h-screen lg:flex-col">
        <Image
          src="/vuiorLogo.png"
          alt="Vuior"
          width={132}
          height={49}
          className="h-auto w-[132px]"
          priority
        />

        <p className="mt-12 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
          Main Menu
        </p>

        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href="#"
                className={`flex h-12 items-center gap-4 rounded-lg px-4 text-[14px] font-medium transition ${
                  item.active
                    ? "bg-[#e8f8f2] text-[#009d62]"
                    : "text-[#263454] hover:bg-[#f8fafc]"
                }`}
              >
                <Icon size={19} strokeWidth={1.8} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-3 rounded-lg border border-[#e1e5ec] p-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-[#e8f8f2]">
            <Image
              src="https://ui-avatars.com/api/?name=Admin+User&background=00a968&color=fff"
              alt="Admin User"
              width={40}
              height={40}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">Admin User</p>
            <p className="truncate text-[11px] text-[#6b7280]">
              admin@vuior.com
            </p>
          </div>
          <ChevronDown size={16} />
        </div>
      </aside>

      <section className="min-w-0 px-5 py-6 sm:px-8 lg:px-9">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.02em] sm:text-[32px]">
              Transaction Management
            </h1>
            <p className="mt-2 text-[14px] text-[#647185]">
              Monitor, review, and track all transactions across the Vuior
              platform.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="flex h-11 w-full items-center rounded-lg border border-[#dfe3eb] bg-white px-4 text-[#8590aa] sm:w-[360px]">
              <input
                placeholder="Search by transaction ID, user, service, status..."
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[#142047] outline-none placeholder:text-[#7b8499]"
              />
              <Search size={19} />
            </label>

            <div className="flex h-11 items-center rounded-lg border border-[#dfe3eb] bg-white p-1 text-[13px] font-semibold">
              {["Today", "Daily", "Monthly", "Yearly", "Custom"].map((item) => (
                <button
                  key={item}
                  className={`h-9 rounded-md px-4 ${
                    item === "Daily"
                      ? "bg-[#009d62] text-white shadow-sm"
                      : "text-[#263454]"
                  }`}
                >
                  {item}
                </button>
              ))}
              <Calendar size={18} className="mx-2 text-[#647185]" />
            </div>

            <div className="flex h-11 items-center gap-3 rounded-full border border-[#e5e9f0] bg-white px-3">
              <Sun size={17} />
              <Moon size={17} />
              <Image
                src="https://ui-avatars.com/api/?name=Admin+User&background=101d4b&color=fff"
                alt="Admin User"
                width={32}
                height={32}
                className="rounded-full"
              />
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const color =
              card.tone === "green"
                ? "#00a968"
                : card.tone === "rose"
                  ? "#f43f5e"
                  : "#7c3aed";

            return (
              <article
                key={card.title}
                className="rounded-xl border border-[#e5e9f0] bg-white p-7 shadow-[0_18px_45px_rgba(35,47,77,0.04)]"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-center gap-5">
                    <div
                      className="flex h-13 w-13 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${color}16`, color }}
                    >
                      <Icon size={25} strokeWidth={1.9} />
                    </div>
                    <div>
                      <p className="text-[13px] text-[#526080]">{card.title}</p>
                      <p className="mt-2 text-[30px] font-bold tracking-[-0.03em]">
                        {card.value}
                      </p>
                    </div>
                  </div>
                  <svg viewBox="0 0 112 32" className="mt-16 h-9 w-32">
                    <path
                      d={card.chart}
                      fill="none"
                      stroke={color}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
                <p className="mt-7 flex items-center gap-2 text-[13px] text-[#647185]">
                  <TrendingUp size={16} className="text-[#00a968]" />
                  <span style={{ color }}>{card.delta.split(" ")[0]}</span>
                  {card.delta.replace(card.delta.split(" ")[0], "")}
                </p>
              </article>
            );
          })}
        </div>

        <section className="mt-7 rounded-xl border border-[#e5e9f0] bg-white p-7 shadow-[0_18px_45px_rgba(35,47,77,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[18px] font-bold">Transaction Volume Trend</h2>
            <button className="flex h-10 items-center gap-8 rounded-lg border border-[#dfe3eb] px-4 text-[13px] font-medium">
              Daily
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_230px]">
            <div className="min-w-0 overflow-x-auto">
              <svg viewBox="0 0 920 250" className="h-[250px] min-w-[860px]">
                {[0, 1, 2, 3, 4, 5].map((line) => (
                  <line
                    key={line}
                    x1="24"
                    x2="890"
                    y1={30 + line * 38}
                    y2={30 + line * 38}
                    stroke="#e9edf3"
                  />
                ))}
                <path
                  d={`${linePath()} L 882 218 L 24 218 Z`}
                  fill="url(#trendFill)"
                />
                <path
                  d={linePath()}
                  fill="none"
                  stroke="#00a968"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                {chartPoints.map((point, index) => (
                  <circle
                    key={`${point}-${index}`}
                    cx={24 + index * 39}
                    cy={218 - (point / 1000) * 180}
                    r="4"
                    fill="#fff"
                    stroke="#00a968"
                    strokeWidth="3"
                  />
                ))}
                <g>
                  <rect
                    x="480"
                    y="26"
                    width="135"
                    height="68"
                    rx="8"
                    fill="#fff"
                    stroke="#e5e9f0"
                  />
                  <text x="493" y="52" fontSize="12" fill="#07142d">
                    Jun 10, 2026
                  </text>
                  <circle cx="496" cy="74" r="5" fill="#00a968" />
                  <text x="508" y="78" fontSize="12" fill="#526080">
                    Transactions: 624
                  </text>
                </g>
                <defs>
                  <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                    <stop stopColor="#00a968" stopOpacity="0.18" />
                    <stop offset="1" stopColor="#00a968" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid gap-6 border-[#e5e9f0] xl:border-l xl:pl-6">
              {[
                ["Highest Volume", "624", "Jun 10, 2026", TrendingUp, "#00a968"],
                ["Lowest Volume", "312", "Jun 04, 2026", TrendingDown, "#f43f5e"],
                ["Average Volume", "456", "per day", BarChart3, "#2587e8"],
              ].map(([label, value, detail, Icon, color]) => (
                <div key={label as string} className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${color}14`,
                      color: color as string,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-[12px] text-[#647185]">{label as string}</p>
                    <p className="mt-1 text-[22px] font-bold">{value as string}</p>
                    <p className="text-[12px] text-[#647185]">{detail as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-7 overflow-hidden rounded-xl border border-[#e5e9f0] bg-white shadow-[0_18px_45px_rgba(35,47,77,0.04)]">
          <div className="flex flex-col gap-4 border-b border-[#e5e9f0] p-6 xl:flex-row xl:items-end xl:justify-between">
            <h2 className="text-[18px] font-bold">Payment History</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:flex">
              {["All Status", "All Services", "All Providers", "Last 30 Days"].map(
                (item) => (
                  <button
                    key={item}
                    className="flex h-10 items-center justify-between gap-8 rounded-lg border border-[#dfe3eb] px-4 text-[13px] font-medium text-[#263454]"
                  >
                    {item}
                    <ChevronDown size={15} />
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-left text-[13px]">
              <thead className="bg-[#f8fafc] text-[#526080]">
                <tr>
                  {[
                    "Transaction ID",
                    "User",
                    "Service",
                    "Provider",
                    "Amount",
                    "Payment Method",
                    "Status",
                    "Date & Time",
                    "Action",
                  ].map((heading) => (
                    <th key={heading} className="px-6 py-4 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction[0]}
                    className="border-t border-[#edf0f5] text-[#142047]"
                  >
                    {transaction.map((cell, index) => (
                      <td key={`${transaction[0]}-${cell}`} className="px-6 py-4">
                        {index === 5 ? (
                          <span className="flex items-center gap-2">
                            {cell.includes("Bank") ? (
                              <Landmark size={16} />
                            ) : cell.includes("Card") ? (
                              <CreditCard size={16} />
                            ) : (
                              <WalletCards size={16} />
                            )}
                            {cell}
                          </span>
                        ) : index === 6 ? (
                          <span
                            className={`rounded-md px-2.5 py-1 text-[12px] font-semibold ${
                              cell === "Success"
                                ? "bg-[#dcfce7] text-[#039855]"
                                : "bg-[#ffe4e6] text-[#e11d48]"
                            }`}
                          >
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <Eye size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#e5e9f0] p-5 text-[13px] text-[#647185] sm:flex-row sm:items-center sm:justify-between">
            <p>Showing 1 to 10 of 1,248 transactions</p>
            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe3eb]">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`h-9 w-9 rounded-lg border text-[13px] font-semibold ${
                    page === 1
                      ? "border-[#009d62] bg-[#009d62] text-white"
                      : "border-[#dfe3eb] text-[#263454]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-2">...</span>
              <button className="h-9 rounded-lg border border-[#dfe3eb] px-3 font-semibold text-[#263454]">
                125
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe3eb]">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
