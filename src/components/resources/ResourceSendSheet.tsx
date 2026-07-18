"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { buildResourceMessage } from "@/lib/resourceMessage";
import Sheet from "@/components/ui/Sheet";
import type { Resource } from "@/types/resource";

const TYPE_ICON: Record<Resource["type"], string> = {
  link: "🔗",
  image: "🖼️",
  file: "📄",
};

export default function ResourceSendSheet({
  bookingId,
  phone,
  onClose,
  onSent,
}: {
  bookingId: number;
  phone: string;
  onClose: () => void;
  onSent: () => void;
}) {
  const { t } = useLocale();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/resources");
        setResources(data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSend(resource: Resource) {
    const digits = phone.replace(/\D/g, "");
    const text = encodeURIComponent(buildResourceMessage(resource));
    window.open(`https://wa.me/${digits}?text=${text}`, "_blank");

    try {
      await api.post(`/bookings/${bookingId}/resource-sends`, {
        resource_id: resource.id,
      });
      onSent();
    } catch {
      // WhatsApp already opened; failing to log the send shouldn't block it.
    }
  }

  return (
    <Sheet title={t.resource.sendSheetTitle} onClose={onClose} centered>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">{t.common.loading}</p>
      ) : resources.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">
          {t.resource.sendEmpty}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {resources.map((resource) => (
            <button
              key={resource.id}
              onClick={() => handleSend(resource)}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left active:bg-zinc-50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xl">
                {TYPE_ICON[resource.type]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-zinc-900">
                  {resource.title_it}
                </span>
                {resource.title_en && (
                  <span className="block truncate text-sm text-zinc-500">
                    {resource.title_en}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-emerald-600">💬</span>
            </button>
          ))}
        </div>
      )}
    </Sheet>
  );
}
