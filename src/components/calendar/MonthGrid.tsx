"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es, it } from "date-fns/locale";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Booking } from "@/types/booking";

const DATE_FNS_LOCALES = { es, it };

export default function MonthGrid({
  month,
  bookingsByDate,
  selectedDate,
  onSelectDay,
  onMonthChange,
}: {
  month: Date;
  bookingsByDate: Record<string, Booking[]>;
  selectedDate: string | null;
  onSelectDay: (date: string) => void;
  onMonthChange: (month: Date) => void;
}) {
  const { locale, t } = useLocale();
  const dateFnsLocale = DATE_FNS_LOCALES[locale];

  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => onMonthChange(subMonths(month, 1))}
          className="rounded-lg px-3 py-1.5 text-lg text-zinc-500 active:bg-zinc-100"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="text-base font-semibold capitalize text-zinc-900">
          {format(month, "MMMM yyyy", { locale: dateFnsLocale })}
        </h2>
        <button
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="rounded-lg px-3 py-1.5 text-lg text-zinc-500 active:bg-zinc-100"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-400">
        {t.calendar.weekdays.map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayBookings = bookingsByDate[dateStr] ?? [];
          const inMonth = isSameMonth(day, month);
          const selected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDay(dateStr)}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm ${
                inMonth ? "text-zinc-900" : "text-zinc-300"
              } ${selected ? "ring-2 ring-brand" : ""} ${
                isToday(day) && !selected ? "bg-brand-light" : ""
              }`}
            >
              <span>{format(day, "d")}</span>
              {dayBookings.length > 0 && (
                <span className="flex max-w-full flex-wrap items-center justify-center gap-0.5 px-0.5">
                  {dayBookings.map((booking) => (
                    <span
                      key={booking.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        booking.is_paid ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
