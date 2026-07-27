"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { UsageGuide } from "@/types/usageGuide";

export default function UsageGuideListItem({
  guide,
  onEdit,
  onDelete,
}: {
  guide: UsageGuide;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-xl">
        📄
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-900">{guide.title}</p>
        {guide.original_filename && (
          <p className="truncate text-sm text-zinc-500">
            {guide.original_filename}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <a
          href={guide.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-zinc-500 active:bg-zinc-100"
          aria-label={t.usageGuide.view}
        >
          👁️
        </a>
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
