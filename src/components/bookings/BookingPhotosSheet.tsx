"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Sheet from "@/components/ui/Sheet";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { BookingPhoto } from "@/types/bookingPhoto";

export default function BookingPhotosSheet({
  bookingId,
  onClose,
  onChanged,
}: {
  bookingId: number;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { t } = useLocale();
  const [photos, setPhotos] = useState<BookingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<BookingPhoto | null>(
    null,
  );

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/bookings/${bookingId}/photos`);
      setPhotos(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete() {
    if (!deletingPhoto) return;
    try {
      await api.delete(`/bookings/${bookingId}/photos/${deletingPhoto.id}`);
      setDeletingPhoto(null);
      await load();
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeletingPhoto(null);
    }
  }

  const grouped = photos.reduce<Record<string, BookingPhoto[]>>(
    (acc, photo) => {
      (acc[photo.category] ??= []).push(photo);
      return acc;
    },
    {},
  );

  return (
    <Sheet title={t.bookingPhotos.sheetTitle} onClose={onClose} centered>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">{t.common.loading}</p>
      ) : photos.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">
          {t.bookingPhotos.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(grouped).map(([category, categoryPhotos]) => (
            <div key={category}>
              <p className="mb-1.5 text-xs font-medium text-zinc-400">
                {t.bookingPhotos.categories[
                  category as keyof typeof t.bookingPhotos.categories
                ]?.label ?? category}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {categoryPhotos.map((photo) => (
                  <div key={photo.id} className="group relative">
                    <a href={photo.url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={photo.url}
                        alt={photo.original_filename ?? ""}
                        className="aspect-square w-full rounded-lg border border-zinc-200 object-cover"
                      />
                    </a>
                    <button
                      onClick={() => setDeletingPhoto(photo)}
                      aria-label={t.common.delete}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1.5 text-white active:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingPhoto && (
        <ConfirmDialog
          message={t.bookingPhotos.deleteConfirm}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPhoto(null)}
        />
      )}
    </Sheet>
  );
}
