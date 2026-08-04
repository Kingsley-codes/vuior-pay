import type { SVGProps } from "react";

type IconName = "arrow" | "calendar" | "check" | "chevron" | "clock" | "gift" | "lock" | "play" | "shield" | "spark" | "support" | "wallet";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  gift: <><rect x="3" y="9" width="18" height="12" rx="2" /><path d="M12 9v12M3 13h18M12 9H7.5a2.5 2.5 0 1 1 2.2-3.7L12 9Zm0 0h4.5a2.5 2.5 0 1 0-2.2-3.7L12 9Z" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
  play: <path d="m9 7 8 5-8 5V7Z" />,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3 7.7 7.5 9.5 4.5-1.8 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m9 12 2 2 4-5" /></>,
  spark: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
  support: <><path d="M4 13v-2a8 8 0 0 1 16 0v2M4 13a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2v1Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1ZM17 17c-1 2-3 3-5 3" /></>,
  wallet: <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18v16H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" /><path d="M4 8h14M15 12h5v4h-5a2 2 0 0 1 0-4Z" /></>,
};

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
