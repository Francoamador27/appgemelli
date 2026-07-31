"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";

export default function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const { t } = useLocale();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        aria-label={t.common.close}
        className="absolute inset-0"
        onClick={onClose}
      />
      <button
        onClick={onClose}
        aria-label={t.common.close}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white active:bg-black/70"
        style={{ top: "calc(1rem + env(safe-area-inset-top))" }}
      >
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="relative z-0 max-h-[90vh] max-w-[95vw] rounded-lg object-contain"
      />
    </div>
  );
}
