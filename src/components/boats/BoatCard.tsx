"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Boat } from "@/types/boat";

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
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3">
      {boat.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={boat.photo_url}
          alt={boat.name}
          className="h-14 w-14 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-light text-xl">
          🚤
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
  );
}
