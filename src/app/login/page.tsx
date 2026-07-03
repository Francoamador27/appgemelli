"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import InstallAppButton from "@/components/pwa/InstallAppButton";
import { inputClass } from "@/components/ui/input-styles";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/login", { name, password });
      setToken(data.token);
      router.push("/calendario");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-center">
          <LanguageSwitcher />
        </div>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white">
            GB
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">
            {t.auth.appName}
          </h1>
          <p className="text-sm text-zinc-500">{t.auth.subtitle}</p>
        </div>

        <div className="mb-6 flex justify-center">
          <InstallAppButton />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label={t.auth.nameLabel}>
            <input
              type="text"
              required
              autoComplete="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label={t.auth.passwordLabel}>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? t.auth.loggingIn : t.auth.loginButton}
          </Button>
        </form>
      </div>
    </div>
  );
}
