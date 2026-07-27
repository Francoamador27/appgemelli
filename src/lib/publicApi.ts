import axios from "axios";
import { getStoredLocale } from "./i18n/LocaleContext";

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
});

publicApi.interceptors.request.use((config) => {
  config.headers["X-Locale"] = getStoredLocale();
  return config;
});

export default publicApi;
