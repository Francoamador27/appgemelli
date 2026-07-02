"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Booking } from "@/types/booking";

function toWaLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export default function BookingListItem({
  booking,
  onEdit,
  onDelete,
}: {
  booking: Booking;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useLocale();
  const channelLabel = booking.channel
    ? t.booking.channels[booking.channel]
    : null;

  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-3 border-l-4 ${
        booking.is_paid ? "border-l-emerald-500" : "border-l-amber-500"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-zinc-900">
            {booking.boat.name}
          </p>
          <p className="truncate text-sm text-zinc-600">
            {booking.client_name || t.booking.noClientName}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={onEdit}
            className="rounded-lg p-2 text-zinc-500 active:bg-zinc-100"
            aria-label={t.common.edit}
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-red-500 active:bg-red-50"
            aria-label={t.common.delete}
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {channelLabel && (
          <span className="rounded-full bg-brand-light px-2 py-1 text-brand">
            {channelLabel}
          </span>
        )}
        <span
          className={`rounded-full px-2 py-1 ${
            booking.has_deposit
              ? "bg-emerald-100 text-emerald-700"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {booking.has_deposit
            ? `${t.booking.deposit}${booking.deposit_amount ? `: $${booking.deposit_amount}` : ""}`
            : t.booking.noDeposit}
        </span>
        <span
          className={`rounded-full px-2 py-1 font-medium ${
            booking.is_paid
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {booking.is_paid
            ? t.booking.paid
            : `${t.booking.pending}${booking.amount_due ? `: $${booking.amount_due}` : ""}`}
        </span>
      </div>

      {booking.client_phone && (
        <div className="mt-3 flex gap-2">
          <a
            href={`tel:${booking.client_phone}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 py-2 text-sm font-medium text-zinc-700 active:bg-zinc-200"
          >
            📞 {t.booking.call}
          </a>
          <a
            href={toWaLink(booking.client_phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-100 py-2 text-sm font-medium text-emerald-700 active:bg-emerald-200"
          >
            💬 {t.booking.whatsapp}
          </a>
        </div>
      )}
    </div>
  );
}
