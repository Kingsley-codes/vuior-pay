"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CreditCard, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { managePaymentMethods, type SavedCard } from "@/services/payments";

export default function PaymentMethodsPanel() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<SavedCard | null>(null);
  const locked = useRef(false);
  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("card") === "success" && params.get("session_id")) {
        await managePaymentMethods({
          action: "confirm",
          sessionId: params.get("session_id")!,
        });
        setMessage(
          "Your card is saved. Bills with autopay enabled will use your default card on their scheduled dates.",
        );
        window.history.replaceState(
          null,
          "",
          "/dashboard/settings?tab=payments",
        );
      } else if (params.get("card") === "cancelled")
        setMessage(
          "Card setup cancelled. You can add a card whenever you are ready.",
        );
      setCards((await managePaymentMethods({ action: "list" })).cards);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load cards.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);
  async function act(
    action: "setupWeb" | "default" | "remove",
    paymentMethodId?: string,
  ) {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await managePaymentMethods({ action, paymentMethodId });
      if (action === "setupWeb" && result.url) {
        window.location.assign(result.url);
        return;
      }
      setCards(result.cards);
      setRemoving(null);
      setMessage(
        action === "default"
          ? "Default card updated for future autopay payments."
          : result.cards.some(card => card.isDefault)
            ? "Card removed. Your remaining default card will be used for autopay."
            : "Card removed. Add a valid card before your next autopay date.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to update cards.",
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return (
    <section
      className="rounded-xl border border-[#dfe6e4] bg-white p-5 sm:p-7"
      aria-labelledby="payment-methods-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id="payment-methods-title"
            className="text-xl font-semibold text-[#172744]"
          >
            Payment methods
          </h2>
          <p className="mt-2 max-w-xl text-base leading-6 text-[#68758d]">
            Manage your saved cards. Your default card is used for bills with
            autopay enabled.
          </p>
        </div>
        <button
          disabled={busy || loading}
          onClick={() => void act("setupWeb")}
          className="flex h-11 items-center gap-2 rounded-lg bg-[#009b67] px-4 text-base font-semibold text-white disabled:opacity-50"
        >
          <Plus size={17} />
          Add card
        </button>
      </div>
      <div className="mt-5 flex items-start gap-2 rounded-lg bg-[#f0faf5] p-4 text-base leading-6 text-[#416454]">
        <ShieldCheck size={20} className="mt-0.5 shrink-0" />
        Cards are securely stored by Stripe. Vuior only displays the card brand,
        last four digits and expiry date.
      </div>
      {error && (
        <p role="alert" className="mt-4 text-base text-red-700">
          {error}{" "}
          <button onClick={() => void load()} className="underline">
            Try again
          </button>
        </p>
      )}
      {message && (
        <p role="status" className="mt-4 text-base text-[#008f60]">
          {message}
        </p>
      )}
      {loading ? (
        <p role="status" className="py-10 text-base text-[#68758d]">
          Loading your cards…
        </p>
      ) : cards.length === 0 ? (
        <div className="py-12 text-center">
          <CreditCard className="mx-auto text-[#009b67]" size={32} />
          <h3 className="mt-3 text-lg font-semibold">No saved cards yet</h3>
          <p className="mt-2 text-base text-[#68758d]">
            Add a card to make future payments easier and get autopay ready.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {cards.map((card) => (
            <li
              key={card.id}
              className={`flex flex-wrap items-center gap-4 rounded-xl border p-4 ${card.isDefault ? "border-[#8ccbb0] bg-[#f8fcfa]" : "border-[#e1e7e4]"}`}
            >
              <span className="grid h-11 w-14 place-items-center rounded-lg border border-[#e1e7e4] bg-white text-[#009b67]">
                <CreditCard size={24} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold capitalize text-[#172744]">
                  {card.brand} •••• {card.last4}
                </p>
                <p className="mt-1 text-sm text-[#68758d]">
                  {card.expired ? "Expired" : "Expires"}{" "}
                  {String(card.expMonth).padStart(2, "0")}/{card.expYear}
                </p>
              </div>
              {card.isDefault ? (
                <span className="rounded-full bg-[#e5f5ec] px-3 py-1 text-sm font-semibold text-[#008f60]">
                  Default
                </span>
              ) : (
                <button
                  disabled={busy || card.expired}
                  onClick={() => void act("default", card.id)}
                  className="text-sm font-semibold text-[#008f60] disabled:opacity-40"
                >
                  Set as default
                </button>
              )}
              <button
                disabled={busy}
                aria-label={`Remove ${card.brand} ending ${card.last4}`}
                onClick={() => setRemoving(card)}
                className="rounded-lg p-2 text-[#68758d] hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {cards.length > 0 && !cards.some((card) => card.isDefault) && (
        <p className="mt-4 text-base text-amber-700">
          Add a valid card to resume autopay. Your saved bills are still
          available.
        </p>
      )}
      {removing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-card-title"
          className="fixed inset-0 z-50 grid place-items-center bg-[#07142d]/60 p-5"
          onKeyDown={(event) => {
            if (event.key === "Escape" && !busy) setRemoving(null);
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 id="remove-card-title" className="text-xl font-semibold">
              Remove this card?
            </h3>
            <p className="mt-3 text-base leading-6 text-[#68758d]">
              Remove {removing.brand} ending {removing.last4}?{" "}
              {removing.isDefault
                ? "Another valid card will become your default. If none remain, autopay cannot process until you add a card."
                : "You can add it again later."}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                autoFocus
                disabled={busy}
                onClick={() => setRemoving(null)}
                className="rounded-lg border px-4 py-2 text-base"
              >
                Keep card
              </button>
              <button
                disabled={busy}
                onClick={() => void act("remove", removing.id)}
                className="rounded-lg bg-red-700 px-4 py-2 text-base font-semibold text-white"
              >
                {busy ? "Removing…" : "Remove card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
