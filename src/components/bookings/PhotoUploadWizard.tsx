"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import publicApi from "@/lib/publicApi";
import { getErrorMessage } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import {
  PHOTO_CATEGORY_VALUES,
  REQUIRED_PHOTO_CATEGORIES,
  type BookingPhotoCategory,
  type PublicBookingInfo,
} from "@/types/bookingPhoto";

export default function PhotoUploadWizard() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [info, setInfo] = useState<PublicBookingInfo | null>(null);
  const [counts, setCounts] = useState<
    Partial<Record<BookingPhotoCategory, number>>
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
        setCounts(data.data.photos_by_category ?? {});
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
      await publicApi.post(`/public/bookings/${token}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCounts((prev) => ({
        ...prev,
        [category]: Number(prev[category] ?? 0) + files.length,
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
        <p className="text-center text-sm text-zinc-500">
          {t.bookingPhotos.invalidLink}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-zinc-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-center text-sm text-red-600">
          {error ?? t.bookingPhotos.invalidLink}
        </p>
      </div>
    );
  }

  const allRequiredDone = REQUIRED_PHOTO_CATEGORIES.every(
    (category) => Number(counts[category] ?? 0) > 0,
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-10">
      <header className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-zinc-900">
            {t.bookingPhotos.uploadPageTitle}
          </p>
          <p className="truncate text-sm text-zinc-500">
            {info.boat_name} · {info.date}
          </p>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="px-4 py-4">
        <p className="mb-4 text-sm text-zinc-600">
          {t.bookingPhotos.uploadIntro}
        </p>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        {allRequiredDone && (
          <p className="mb-4 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700">
            {t.bookingPhotos.allDone}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {PHOTO_CATEGORY_VALUES.map((category) => {
            const catT = t.bookingPhotos.categories[category];
            const count = Number(counts[category] ?? 0);
            const required = REQUIRED_PHOTO_CATEGORIES.includes(category);
            const isUploading = uploadingCategory === category;

            return (
              <div
                key={category}
                className="rounded-xl border border-zinc-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-zinc-900">{catT.label}</p>
                  {required && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      {t.bookingPhotos.required}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  {catT.instructions}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-500">
                    {count > 0
                      ? `✓ ${t.bookingPhotos.photosCount.replace("{n}", String(count))}`
                      : ""}
                  </span>
                  <label className="shrink-0 cursor-pointer rounded-lg bg-brand-light px-3 py-2 text-sm font-medium text-brand active:bg-brand-light/70">
                    {isUploading
                      ? t.bookingPhotos.uploading
                      : t.bookingPhotos.addPhotos}
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
