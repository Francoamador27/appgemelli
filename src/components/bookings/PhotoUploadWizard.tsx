"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import publicApi from "@/lib/publicApi";
import { getErrorMessage } from "@/lib/errors";
import Sheet from "@/components/ui/Sheet";
import {
  PUBLIC_CATEGORIES,
  PUBLIC_UI,
  type Trilingual,
} from "@/lib/i18n/publicPhotoTranslations";
import {
  PHOTO_CATEGORY_VALUES,
  REQUIRED_PHOTO_CATEGORIES,
  type BookingPhoto,
  type BookingPhotoCategory,
  type PublicBookingInfo,
} from "@/types/bookingPhoto";
import type { BookingNote } from "@/types/bookingNote";
import type { UsageGuide } from "@/types/usageGuide";

function triLine(text: Trilingual): string {
  return `${text.it} / ${text.en} / ${text.es}`;
}

function timestamp(value: string): string {
  return format(new Date(value), "dd/MM/yyyy HH:mm");
}

function Tri({ text, className }: { text: Trilingual; className?: string }) {
  return (
    <div className={className}>
      <p>🇮🇹 {text.it}</p>
      <p>🇬🇧 {text.en}</p>
      <p>🇪🇸 {text.es}</p>
    </div>
  );
}

export default function PhotoUploadWizard() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [info, setInfo] = useState<PublicBookingInfo | null>(null);
  const [photos, setPhotos] = useState<
    Partial<Record<BookingPhotoCategory, BookingPhoto[]>>
  >({});
  const [notes, setNotes] = useState<BookingNote[]>([]);
  const [noteText, setNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCategory, setUploadingCategory] =
    useState<BookingPhotoCategory | null>(null);
  const [usageGuides, setUsageGuides] = useState<UsageGuide[]>([]);
  const [tripMapUrl, setTripMapUrl] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [showGuides, setShowGuides] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [bookingRes, guidesRes, mapRes] = await Promise.all([
          publicApi.get(`/public/bookings/${token}`),
          publicApi
            .get("/public/usage-guides")
            .catch(() => ({ data: { data: [] } })),
          publicApi
            .get("/public/trip-map")
            .catch(() => ({ data: { data: { url: null } } })),
        ]);
        setInfo(bookingRes.data.data);
        setPhotos(bookingRes.data.data.photos_by_category ?? {});
        setNotes(bookingRes.data.data.notes ?? []);
        setUsageGuides(guidesRes.data.data);
        setTripMapUrl(mapRes.data.data.url);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  async function handleSubmitNote() {
    if (!noteText.trim() || !token) return;

    setSubmittingNote(true);
    setError(null);

    try {
      const { data } = await publicApi.post(`/public/bookings/${token}/notes`, {
        text: noteText.trim(),
      });
      setNotes((prev) => [...prev, data.data]);
      setNoteText("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmittingNote(false);
    }
  }

  async function handleFilesSelected(
    category: BookingPhotoCategory,
    files: FileList,
  ) {
    if (!files.length || !token) return;

    setUploadingCategory(category);
    setError(null);

    const formData = new FormData();
    formData.append("category", category);
    Array.from(files).forEach((file) => formData.append("photos[]", file));

    try {
      const { data } = await publicApi.post(
        `/public/bookings/${token}/photos`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setPhotos((prev) => ({
        ...prev,
        [category]: [...(prev[category] ?? []), ...data.data],
      }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploadingCategory(null);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Tri text={PUBLIC_UI.invalidLink} className="text-center text-sm text-zinc-500" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Tri text={PUBLIC_UI.loading} className="text-center text-sm text-zinc-500" />
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Tri text={PUBLIC_UI.invalidLink} className="text-center text-sm text-red-600" />
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-zinc-50 px-6 text-center">
        <p className="text-4xl">🛥️</p>
        <Tri
          text={PUBLIC_UI.finishedThanks}
          className="text-base font-medium text-zinc-800"
        />
      </div>
    );
  }

  const allRequiredDone = REQUIRED_PHOTO_CATEGORIES.every(
    (category) => (photos[category] ?? []).length > 0,
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-10">
      <header className="border-b border-zinc-200 bg-white px-4 py-3">
        <Tri text={PUBLIC_UI.pageTitle} className="font-semibold text-zinc-900" />
        <p className="mt-1 truncate text-sm text-zinc-500">
          {info.boat_name} · {info.date}
        </p>
      </header>

      <div className="px-4 py-4">
        <Tri text={PUBLIC_UI.intro} className="mb-4 text-sm text-zinc-600" />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        {allRequiredDone && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700">
            <Tri text={PUBLIC_UI.allDone} />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {PHOTO_CATEGORY_VALUES.map((category) => {
            const catT = PUBLIC_CATEGORIES[category];
            const categoryPhotos = photos[category] ?? [];
            const required = REQUIRED_PHOTO_CATEGORIES.includes(category);
            const isUploading = uploadingCategory === category;

            return (
              <div
                key={category}
                className="rounded-xl border border-zinc-200 bg-white p-4"
              >
                {required && (
                  <span className="mb-1.5 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    {triLine(PUBLIC_UI.required)}
                  </span>
                )}
                <Tri text={catT.label} className="font-medium text-zinc-900" />
                <Tri
                  text={catT.instructions}
                  className="mt-1 text-sm text-zinc-600"
                />

                {categoryPhotos.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {categoryPhotos.map((photo) => (
                      <div key={photo.id}>
                        <a href={photo.url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={photo.url}
                            alt={photo.original_filename ?? ""}
                            className="aspect-square w-full rounded-lg border border-zinc-200 object-cover"
                          />
                        </a>
                        <p className="mt-0.5 text-center text-[10px] text-zinc-400">
                          {timestamp(photo.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <label className="mt-3 block w-full cursor-pointer rounded-lg bg-brand-light px-3 py-2 text-center text-sm font-medium text-brand active:bg-brand-light/70">
                  {isUploading
                    ? triLine(PUBLIC_UI.uploading)
                    : triLine(PUBLIC_UI.addPhotos)}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    disabled={isUploading}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFilesSelected(category, e.target.files);
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            );
          })}

          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <Tri text={PUBLIC_UI.notesTitle} className="font-medium text-zinc-900" />
            <Tri
              text={PUBLIC_UI.notesInstructions}
              className="mt-1 text-sm text-zinc-600"
            />

            {notes.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                  >
                    <p>{note.text}</p>
                    <p className="mt-1 text-[10px] text-zinc-400">
                      {timestamp(note.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={`${PUBLIC_UI.notePlaceholder.it} / ${PUBLIC_UI.notePlaceholder.en} / ${PUBLIC_UI.notePlaceholder.es}`}
              rows={3}
              className="mt-3 w-full rounded-lg border border-zinc-200 p-2 text-sm text-zinc-900 placeholder:text-zinc-400"
            />
            <button
              onClick={handleSubmitNote}
              disabled={submittingNote || !noteText.trim()}
              className="mt-2 w-full rounded-lg bg-brand-light px-3 py-2 text-sm font-medium text-brand active:bg-brand-light/70 disabled:opacity-50"
            >
              {submittingNote
                ? triLine(PUBLIC_UI.sending)
                : triLine(PUBLIC_UI.submitNote)}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              onClick={() => setFinished(true)}
              className="rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white active:bg-emerald-700"
            >
              ✅ {triLine(PUBLIC_UI.finish)}
            </button>

            {tripMapUrl && (
              <a
                href={tripMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-lg bg-brand-light px-3 py-2.5 text-center text-sm font-medium text-brand active:bg-brand-light/70"
              >
                🗺️ {triLine(PUBLIC_UI.tripMap)}
              </a>
            )}

            {usageGuides.length > 0 && (
              <button
                onClick={() => setShowGuides(true)}
                className="rounded-lg bg-brand-light px-3 py-2.5 text-sm font-medium text-brand active:bg-brand-light/70"
              >
                📘 {triLine(PUBLIC_UI.usageGuide)}
              </button>
            )}
          </div>
        </div>
      </div>

      {showGuides && (
        <Sheet
          title={triLine(PUBLIC_UI.usageGuideModalTitle)}
          onClose={() => setShowGuides(false)}
          centered
        >
          <div className="flex flex-col gap-2">
            {usageGuides.map((guide) => (
              <a
                key={guide.id}
                href={guide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 active:bg-zinc-50"
              >
                <span className="text-xl">📄</span>
                <span className="font-medium text-zinc-900">{guide.title}</span>
              </a>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  );
}
