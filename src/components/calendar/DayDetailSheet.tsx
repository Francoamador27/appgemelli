"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es, it } from "date-fns/locale";
import api from "@/lib/api";
import { isNotFoundError } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Sheet from "@/components/ui/Sheet";
import BookingForm from "@/components/bookings/BookingForm";
import BookingListItem from "@/components/bookings/BookingListItem";
import type { Boat } from "@/types/boat";
import type { Booking } from "@/types/booking";

const DATE_FNS_LOCALES = { es, it };
const DAY_TITLE_FORMAT = { es: "EEEE d 'de' MMMM", it: "EEEE d MMMM" };

export default function DayDetailSheet({
  date,
  bookings,
  boats,
  onClose,
  onChanged,
}: {
  date: string;
  bookings: Booking[];
  boats: Boat[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const { locale, t } = useLocale();
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(
    null,
  );

  function openCreate() {
    setEditingBooking(null);
    setShowForm(true);
  }

  function openEdit(booking: Booking) {
    setEditingBooking(booking);
    setShowForm(true);
  }

  function handleSaved() {
    setShowForm(false);
    onChanged();
  }

  async function handleDelete() {
    if (!deletingBooking) return;
    try {
      await api.delete(`/bookings/${deletingBooking.id}`);
    } catch (err) {
      if (!isNotFoundError(err)) throw err;
    }
    setDeletingBooking(null);
    onChanged();
  }

  const title = format(parseISO(date), DAY_TITLE_FORMAT[locale], {
    locale: DATE_FNS_LOCALES[locale],
  });

  return (
    <>
      <Sheet
        title={title.charAt(0).toUpperCase() + title.slice(1)}
        onClose={onClose}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            {bookings.length}/{boats.length}
          </p>
          <Button onClick={openCreate} className="text-xs">
            {t.calendar.newBooking}
          </Button>
        </div>

        {bookings.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-400">
            {t.calendar.noBookings}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {bookings.map((booking) => (
              <BookingListItem
                key={booking.id}
                booking={booking}
                onEdit={() => openEdit(booking)}
                onDelete={() => setDeletingBooking(booking)}
              />
            ))}
          </div>
        )}
      </Sheet>

      {showForm && (
        <BookingForm
          boats={boats}
          date={date}
          booking={editingBooking ?? undefined}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {deletingBooking && (
        <ConfirmDialog
          message={t.booking.deleteConfirm.replace(
            "{target}",
            `${deletingBooking.boat.name}${deletingBooking.client_name ? ` (${deletingBooking.client_name})` : ""}`,
          )}
          onConfirm={handleDelete}
          onCancel={() => setDeletingBooking(null)}
        />
      )}
    </>
  );
}
