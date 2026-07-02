import axios from "axios";
import { getStoredLocale } from "./i18n/LocaleContext";
import { translations } from "./i18n/translations";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0];
      if (firstError?.[0]) return firstError[0];
    }

    if (data?.message) return data.message;
  }

  return translations.errors.generic[getStoredLocale()];
}

export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
