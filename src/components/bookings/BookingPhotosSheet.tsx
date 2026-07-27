"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Sheet from "@/components/ui/Sheet";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { BookingPhoto } from "@/types/bookingPhoto";
import type { BookingNote } from "@/types/bookingNote";

function timestamp(value: string): string {
  return format(new Date(value), "dd/MM/yyyy HH:mm");
}

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
  const [notes, setNotes] = useState<BookingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<BookingPhoto | null>(
    null,
  );
  const [deletingNote, setDeletingNote] = useState<BookingNote | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [photosRes, notesRes] = await Promise.all([
        api.get(`/bookings/${bookingId}/photos`),
        api.get(`/bookings/${bookingId}/notes`),
      ]);
      setPhotos(photosRes.data.data);
      setNotes(notesRes.data.data);
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

  async function handleDeletePhoto() {
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

  async function handleDeleteNote() {
    if (!deletingNote) return;
    try {
      await api.delete(`/bookings/${bookingId}/notes/${deletingNote.id}`);
      setDeletingNote(null);
      await load();
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeletingNote(null);
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
      ) : (
        <div className="flex flex-col gap-5">
          <div>
            {photos.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-400">
                {t.bookingPhotos.empty}
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {Object.entries(grouped).map(([category, categoryPhotos]) => (
                  <div key={category}>
                    <p className="mb-1.5 text-xs font-medium text-zinc-400">
                      {t.bookingPhotos.categories[
                        category as keyof typeof t.bookingPhotos.categories
                      ] ?? category}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {categoryPhotos.map((photo) => (
                        <div key={photo.id} className="group relative">
                          <a
                            href={photo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
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
                          <p className="mt-0.5 text-center text-[10px] text-zinc-400">
                            {timestamp(photo.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-100 pt-3">
            <p className="mb-1.5 text-xs font-medium text-zinc-400">
              {t.bookingPhotos.notesSectionTitle}
            </p>
            {notes.length === 0 ? (
              <p className="py-2 text-center text-sm text-zinc-400">
                {t.bookingPhotos.notesEmpty}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-700">{note.text}</p>
                      <p className="mt-1 text-[10px] text-zinc-400">
                        {timestamp(note.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => setDeletingNote(note)}
                      aria-label={t.common.delete}
                      className="shrink-0 rounded-full p-1.5 text-zinc-400 active:bg-red-50 active:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {deletingPhoto && (
        <ConfirmDialog
          message={t.bookingPhotos.deleteConfirm}
          onConfirm={handleDeletePhoto}
          onCancel={() => setDeletingPhoto(null)}
        />
      )}

      {deletingNote && (
        <ConfirmDialog
          message={t.bookingPhotos.noteDeleteConfirm}
          onConfirm={handleDeleteNote}
          onCancel={() => setDeletingNote(null)}
        />
      )}
    </Sheet>
  );
}
