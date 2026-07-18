"use client";

import { ReactNode } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function Sheet({
  title,
  onClose,
  children,
  centered = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  centered?: boolean;
}) {
  const { t } = useLocale();

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center ${centered ? "items-center" : "items-end sm:items-center"}`}
    >
      <button
        aria-label={t.common.close}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto bg-white p-5 sm:max-w-md sm:rounded-2xl ${centered ? "rounded-2xl" : "rounded-t-2xl pb-[calc(1.25rem+env(safe-area-inset-bottom))]"}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label={t.common.close}
            className="rounded-full p-1.5 text-zinc-500 active:bg-zinc-100"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
