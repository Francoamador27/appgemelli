"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import publicApi from "@/lib/publicApi";
import { getErrorMessage } from "@/lib/errors";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCategory, setUploadingCategory] =
    useState<BookingPhotoCategory | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await publicApi.get(`/public/bookings/${token}`);
        setInfo(data.data);
        setPhotos(data.data.photos_by_category ?? {});
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

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
                    {PUBLIC_UI.required.it} / {PUBLIC_UI.required.en} /{" "}
                    {PUBLIC_UI.required.es}
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
                      <a
                        key={photo.id}
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
                    ))}
                  </div>
                )}

                <label className="mt-3 block w-full cursor-pointer rounded-lg bg-brand-light px-3 py-2 text-center text-sm font-medium text-brand active:bg-brand-light/70">
                  {isUploading
                    ? `${PUBLIC_UI.uploading.it} / ${PUBLIC_UI.uploading.en} / ${PUBLIC_UI.uploading.es}`
                    : `${PUBLIC_UI.addPhotos.it} / ${PUBLIC_UI.addPhotos.en} / ${PUBLIC_UI.addPhotos.es}`}
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
        </div>
      </div>
    </div>
  );
}
