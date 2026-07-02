"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { LOCALES } from "@/lib/i18n/translations";

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={`inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 ${className}`}>
      {LOCALES.map((l) => (
        <button
          key={l.value}
          onClick={() => setLocale(l.value)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            locale === l.value
              ? "bg-brand text-white"
              : "text-zinc-500 active:bg-zinc-100"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
