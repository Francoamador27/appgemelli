"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  buildResourceMessage,
  buildTripMapMessage,
  buildUsageGuideMessage,
} from "@/lib/resourceMessage";
import Sheet from "@/components/ui/Sheet";
import type { Resource } from "@/types/resource";
import type { UsageGuide } from "@/types/usageGuide";

const TYPE_ICON: Record<Resource["type"], string> = {
  link: "🔗",
  image: "🖼️",
  file: "📄",
};

type Tab = "resources" | "guides" | "map";

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
  const [tab, setTab] = useState<Tab>("resources");
  const [resources, setResources] = useState<Resource[]>([]);
  const [guides, setGuides] = useState<UsageGuide[]>([]);
  const [tripMapUrl, setTripMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [resourcesRes, guidesRes, tripMapRes] = await Promise.all([
          api.get("/resources"),
          api.get("/usage-guides"),
          api.get("/trip-map"),
        ]);
        setResources(resourcesRes.data.data);
        setGuides(guidesRes.data.data);
        setTripMapUrl(tripMapRes.data.data.url ?? null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function openWhatsapp(text: string) {
    const digits = phone.replace(/\D/g, "");
    window.open(
      `https://wa.me/${digits}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  }

  async function handleSendResource(resource: Resource) {
    openWhatsapp(buildResourceMessage(resource));
    try {
      await api.post(`/bookings/${bookingId}/resource-sends`, {
        resource_id: resource.id,
      });
      onSent();
    } catch {
      // WhatsApp already opened; failing to log the send shouldn't block it.
    }
  }

  function handleSendGuide(guide: UsageGuide) {
    openWhatsapp(buildUsageGuideMessage(guide));
    onSent();
  }

  function handleSendMap() {
    if (!tripMapUrl) return;
    openWhatsapp(buildTripMapMessage(t.tripMap.menuTitle, tripMapUrl));
    onSent();
  }

  const tabs: { value: Tab; label: string }[] = [
    { value: "resources", label: t.resource.menuTitle },
    { value: "guides", label: t.usageGuide.menuTitle },
    { value: "map", label: t.tripMap.menuTitle },
  ];

  return (
    <Sheet title={t.resource.sendSheetTitle} onClose={onClose} centered>
      <div className="mb-4 inline-flex rounded-lg border border-zinc-200 bg-white p-0.5">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.value}
            onClick={() => setTab(tabItem.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === tabItem.value
                ? "bg-brand text-white"
                : "text-zinc-500 active:bg-zinc-100"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">{t.common.loading}</p>
      ) : (
        <>
          {tab === "resources" &&
            (resources.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-400">
                {t.resource.sendEmpty}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {resources.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => handleSendResource(resource)}
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
            ))}

          {tab === "guides" &&
            (guides.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-400">
                {t.usageGuide.empty}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {guides.map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => handleSendGuide(guide)}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left active:bg-zinc-50"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xl">
                      📄
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-zinc-900">
                        {guide.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-emerald-600">💬</span>
                  </button>
                ))}
              </div>
            ))}

          {tab === "map" &&
            (!tripMapUrl ? (
              <p className="py-6 text-center text-sm text-zinc-400">
                {t.resource.sendMapEmpty}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSendMap}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left active:bg-zinc-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xl">
                    🗺️
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-zinc-900">
                      {t.tripMap.menuTitle}
                    </span>
                  </span>
                  <span className="shrink-0 text-emerald-600">💬</span>
                </button>
              </div>
            ))}
        </>
      )}
    </Sheet>
  );
}
