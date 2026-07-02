"use client";

import { FormEvent, useEffect, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage, isNotFoundError } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Sheet from "@/components/ui/Sheet";
import { inputClass } from "@/components/ui/input-styles";
import type { Boat } from "@/types/boat";
import { BOOKING_CHANNEL_VALUES, type Booking } from "@/types/booking";

export default function BookingForm({
  boats,
  date,
  boatId,
  booking,
  onClose,
  onSaved,
}: {
  boats: Boat[];
  date: string;
  boatId?: number;
  booking?: Booking;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [selectedBoatId, setSelectedBoatId] = useState<number | "">(
    booking?.boat_id ?? boatId ?? "",
  );
  const [selectedDate, setSelectedDate] = useState(booking?.date ?? date);
  const [clientName, setClientName] = useState(booking?.client_name ?? "");
  const [clientPhone, setClientPhone] = useState(booking?.client_phone ?? "");
  const [channel, setChannel] = useState(booking?.channel ?? "directo");
  const [hasDeposit, setHasDeposit] = useState(booking?.has_deposit ?? false);
  const [depositAmount, setDepositAmount] = useState(
    booking?.deposit_amount ?? "",
  );
  const [isPaid, setIsPaid] = useState(booking?.is_paid ?? false);
  const [amountDue, setAmountDue] = useState(booking?.amount_due ?? "");
  const [notes, setNotes] = useState(booking?.notes ?? "");

  const [available, setAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedBoatId || !selectedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset availability state when selection is incomplete
      setAvailable(null);
      return;
    }

    let cancelled = false;
    setCheckingAvailability(true);

    const params: Record<string, string | number> = {
      boat_id: selectedBoatId,
      date: selectedDate,
    };
    if (booking) params.exclude_booking_id = booking.id;

    api
      .get("/bookings/availability", { params })
      .then(({ data }) => {
        if (!cancelled) setAvailable(data.available);
      })
      .catch(() => {
        if (!cancelled) setAvailable(null);
      })
      .finally(() => {
        if (!cancelled) setCheckingAvailability(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedBoatId, selectedDate, booking]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (available === false) return;

    setError(null);
    setLoading(true);

    const payload = {
      boat_id: selectedBoatId,
      date: selectedDate,
      client_name: clientName || null,
      client_phone: clientPhone || null,
      channel,
      has_deposit: hasDeposit,
      deposit_amount: hasDeposit ? depositAmount || null : null,
      is_paid: isPaid,
      amount_due: !isPaid ? amountDue || null : null,
      notes: notes || null,
    };

    try {
      if (booking) {
        await api.put(`/bookings/${booking.id}`, payload);
      } else {
        await api.post("/bookings", payload);
      }
      onSaved();
    } catch (err) {
      if (booking && isNotFoundError(err)) {
        onSaved();
        return;
      }
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet
      title={booking ? t.booking.editTitle : t.booking.newTitle}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label={t.booking.boatLabel}>
          <select
            required
            value={selectedBoatId}
            onChange={(e) =>
              setSelectedBoatId(e.target.value ? Number(e.target.value) : "")
            }
            className={inputClass}
          >
            <option value="">{t.booking.selectBoat}</option>
            {boats.map((boat) => (
              <option key={boat.id} value={boat.id}>
                {boat.name} ({boat.type})
              </option>
            ))}
          </select>
        </Field>

        <Field label={t.booking.dateLabel}>
          <input
            type="date"
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={inputClass}
          />
        </Field>

        {checkingAvailability && (
          <p className="text-xs text-zinc-500">
            {t.booking.checkingAvailability}
          </p>
        )}
        {!checkingAvailability && available === false && (
          <p className="text-sm text-red-600">{t.booking.notAvailable}</p>
        )}
        {!checkingAvailability && available === true && (
          <p className="text-sm text-emerald-600">{t.booking.available}</p>
        )}

        <Field label={t.booking.clientLabel}>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label={t.booking.phoneLabel}>
          <input
            type="tel"
            placeholder="+54 9 11 ..."
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label={t.booking.channelLabel}>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as typeof channel)}
            className={inputClass}
          >
            {BOOKING_CHANNEL_VALUES.map((value) => (
              <option key={value} value={value}>
                {t.booking.channels[value]}
              </option>
            ))}
          </select>
        </Field>

        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          <input
            type="checkbox"
            checked={hasDeposit}
            onChange={(e) => setHasDeposit(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand"
          />
          {t.booking.hasDeposit}
        </label>

        {hasDeposit && (
          <Field label={t.booking.depositAmount}>
            <input
              type="number"
              min={0}
              step="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className={inputClass}
            />
          </Field>
        )}

        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          <input
            type="checkbox"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand"
          />
          {t.booking.isPaid}
        </label>

        {!isPaid && (
          <Field label={t.booking.amountDue}>
            <input
              type="number"
              min={0}
              step="0.01"
              value={amountDue}
              onChange={(e) => setAmountDue(e.target.value)}
              className={inputClass}
            />
          </Field>
        )}

        <Field label={t.booking.notes}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          disabled={loading || available === false}
          className="mt-2 w-full"
        >
          {loading ? t.booking.saving : t.booking.save}
        </Button>
      </form>
    </Sheet>
  );
}
