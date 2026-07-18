"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import type { Boat } from "@/types/boat";

function toWaImageShareLink(boat: Boat): string {
  const text = `${boat.name}\n${boat.photo_url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export default function BoatCard({
  boat,
  onEdit,
  onDelete,
}: {
  boat: Boat;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useLocale();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-3">
        {boat.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={boat.photo_url}
            alt={boat.name}
            className="h-14 w-14 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-light text-xl">
            🚤.
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-zinc-900">{boat.name}</p>
          <p className="truncate text-sm text-zinc-500">
            {boat.type} · {boat.capacity} {t.boat.people}
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

      {boat.photo_url && (
        <a
          href={toWaImageShareLink(boat)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-100 py-2 text-sm font-medium text-emerald-700 active:bg-emerald-200"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {t.boat.shareImage}
        </a>
      )}
    </div>
  );
}
