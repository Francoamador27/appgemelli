"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { toWaShareLink } from "@/lib/resourceMessage";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import type { Resource } from "@/types/resource";

const TYPE_ICON: Record<Resource["type"], string> = {
  link: "🔗",
  image: "🖼️",
  file: "📄",
};

export default function ResourceListItem({
  resource,
  onEdit,
  onDelete,
}: {
  resource: Resource;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useLocale();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: resource.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 touch-none px-1 py-2 text-zinc-400 active:text-zinc-600"
        aria-label={t.resource.reorderHandle}
      >
        ⠿
      </button>

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-xl">
        {TYPE_ICON[resource.type]}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-900">
          {resource.title_it}
        </p>
        {resource.title_en && (
          <p className="truncate text-sm text-zinc-500">{resource.title_en}</p>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <a
          href={toWaShareLink(resource)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-emerald-600 active:bg-emerald-50"
          aria-label={t.resource.shareWhatsapp}
        >
          <WhatsAppIcon className="h-5 w-5" />
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
