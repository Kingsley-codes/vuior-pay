"use client";

import {
  Bell,
  Check,
  CheckCheck,
  Clock3,
  CreditCard,
  Gift,
  ReceiptText,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";

function relativeTime(date: Date | null) {
  if (!date) return "Just now";
  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

function NotificationIcon({ kind }: { kind: AppNotification["kind"] }) {
  const common = "h-[18px] w-[18px]";
  if (kind === "autopay") return <Clock3 className={common} />;
  if (kind === "credits") return <Gift className={common} />;
  if (kind === "payment") return <ReceiptText className={common} />;
  if (kind === "reminder") return <CreditCard className={common} />;
  return <Bell className={common} />;
}

export default function NotificationsMenu({ userId }: { userId?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markRead, markAllRead, remove, clearAll } =
    useNotifications(userId);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-10 w-10 place-items-center rounded-lg border border-[#dfe6e4] bg-white text-[#53617a] transition hover:bg-[#f5f8f7] hover:text-[#008f60]"
      >
        <Bell size={18} />
        {unreadCount ? <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#00a96b] px-1 text-[9px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span> : null}
      </button>
      {open ? (
        <section className="absolute right-0 z-[60] mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-[#dfe6e4] bg-white shadow-[0_18px_48px_rgba(20,43,36,.18)]" aria-label="Notifications">
          <header className="flex items-center justify-between border-b border-[#edf1ef] px-4 py-3.5">
            <div><h2 className="text-[14px] font-bold text-[#0d1b42]">Notifications</h2><p className="mt-0.5 text-[11px] text-[#718097]">{unreadCount ? `${unreadCount} unread` : "You’re all caught up"}</p></div>
            <div className="flex items-center gap-1">
              {unreadCount ? <button type="button" onClick={() => void markAllRead()} className="grid h-8 w-8 place-items-center rounded-md text-[#008f60] hover:bg-[#eaf8f2]" aria-label="Mark all as read"><CheckCheck size={17} /></button> : null}
              {notifications.length ? <button type="button" onClick={() => void clearAll()} className="grid h-8 w-8 place-items-center rounded-md text-[#a9404b] hover:bg-[#fff1f2]" aria-label="Clear all notifications"><Trash2 size={16} /></button> : null}
            </div>
          </header>
          <div className="max-h-[min(32rem,calc(100vh-8rem))] overflow-y-auto">
            {notifications.length ? notifications.map((item) => (
              <article key={item.id} className={`group flex gap-3 border-b border-[#edf1ef] px-4 py-3 transition last:border-0 ${item.read ? "bg-white" : "bg-[#f2fbf7]"}`}>
                <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${item.kind === "credits" ? "bg-[#fdf1db] text-[#c47b00]" : "bg-[#eaf8f2] text-[#009b67]"}`}><NotificationIcon kind={item.kind} /></span>
                <button type="button" onClick={() => !item.read && void markRead(item.id)} className="min-w-0 flex-1 text-left">
                  <p className="flex items-center gap-2 text-[12px] font-semibold text-[#16254b]"><span className="truncate">{item.title}</span>{!item.read ? <i className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a96b]" /> : null}</p>
                  <p className="mt-1 text-[11px] leading-4 text-[#66748b]">{item.message}</p>
                  <p className="mt-1.5 text-[10px] text-[#8a95a6]">{relativeTime(item.createdAt)}</p>
                </button>
                <div className="flex shrink-0 flex-col opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  {!item.read ? <button type="button" onClick={() => void markRead(item.id)} className="grid h-7 w-7 place-items-center rounded-md text-[#008f60] hover:bg-[#dff5eb]" aria-label={`Mark ${item.title} as read`}><Check size={15} /></button> : null}
                  <button type="button" onClick={() => void remove(item.id)} className="grid h-7 w-7 place-items-center rounded-md text-[#8b96a7] hover:bg-[#fff1f2] hover:text-[#c2414d]" aria-label={`Delete ${item.title}`}><Trash2 size={14} /></button>
                </div>
              </article>
            )) : <div className="px-6 py-12 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#eaf8f2] text-[#009b67]"><Bell size={20} /></span><p className="mt-3 text-[13px] font-semibold text-[#16254b]">No notifications yet</p><p className="mt-1 text-[11px] leading-4 text-[#718097]">Autopay activity and credit gifts will appear here.</p></div>}
          </div>
        </section>
      ) : null}
    </div>
  );
}
