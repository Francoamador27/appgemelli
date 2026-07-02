"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  type Locale,
  translations,
} from "./translations";

const STORAGE_KEY = "gemelliboat_locale";

type LocaleValue = Record<Locale, string | string[]>;

function isLocaleValue(node: unknown): node is LocaleValue {
  return (
    typeof node === "object" &&
    node !== null &&
    "es" in node &&
    "it" in node
  );
}

type Resolved<T> = T extends LocaleValue
  ? T["es"]
  : { [K in keyof T]: Resolved<T[K]> };

function resolve<T>(tree: T, locale: Locale): Resolved<T> {
  if (isLocaleValue(tree)) {
    return tree[locale] as Resolved<T>;
  }
  const result = {} as Resolved<T>;
  for (const key in tree) {
    result[key as keyof Resolved<T>] = resolve(
      tree[key],
      locale,
    ) as Resolved<T>[keyof Resolved<T>];
  }
  return result;
}

type Dictionary = Resolved<typeof translations>;

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "it") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate persisted locale on mount
      setLocaleState(stored);
    }
  }, []);

  function setLocale(next: Locale) {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: resolve(translations, locale) }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "es" || stored === "it" ? stored : DEFAULT_LOCALE;
}
