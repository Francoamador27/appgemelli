"use client";

import { useEffect, useMemo, useState } from "react";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import MonthGrid from "@/components/calendar/MonthGrid";
import DayDetailSheet from "@/components/calendar/DayDetailSheet";
import BookingForm from "@/components/bookings/BookingForm";
import type { Boat } from "@/types/boat";
import type { Booking } from "@/types/booking";

export default function CalendarioPage() {
  const { t } = useLocale();
  const [month, setMonth] = useState(() => new Date());
  const [boats, setBoats] = useState<Boat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const range = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return {
      from: format(gridStart, "yyyy-MM-dd"),
      to: format(gridEnd, "yyyy-MM-dd"),
    };
  }, [month]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [boatsRes, bookingsRes] = await Promise.all([
        api.get("/boats"),
        api.get("/bookings", { params: range }),
      ]);
      setBoats(boatsRes.data.data);
      setBookings(bookingsRes.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refetch when visible month range changes
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.from, range.to]);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const booking of bookings) {
      if (!map[booking.date]) map[booking.date] = [];
      map[booking.date].push(booking);
    }
    return map;
  }, [bookings]);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">
          {t.calendar.title}
        </h1>
        <Button onClick={() => setShowQuickAdd(true)} className="text-xs">
          {t.calendar.newBooking}
        </Button>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-zinc-500">{t.calendar.loading}</p>
      ) : (
        <MonthGrid
          month={month}
          bookingsByDate={bookingsByDate}
          selectedDate={selectedDate}
          onSelectDay={setSelectedDate}
          onMonthChange={setMonth}
        />
      )}

      {selectedDate && (
        <DayDetailSheet
          date={selectedDate}
          bookings={bookingsByDate[selectedDate] ?? []}
          boats={boats}
          onClose={() => setSelectedDate(null)}
          onChanged={loadData}
        />
      )}

      {showQuickAdd && (
        <BookingForm
          boats={boats}
          date={selectedDate ?? todayStr}
          onClose={() => setShowQuickAdd(false)}
          onSaved={() => {
            setShowQuickAdd(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
