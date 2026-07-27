"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { inputClass } from "@/components/ui/input-styles";

export default function TripMapForm() {
  const { t } = useLocale();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/trip-map");
        setUrl(data.data.url ?? "");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.put("/trip-map", { url: url.trim() || null });
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">{t.common.loading}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-600">{t.tripMap.description}</p>

      <Field label={t.tripMap.urlLabel}>
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setSaved(false);
          }}
          placeholder="https://maps.app.goo.gl/..."
          className={inputClass}
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-600">{t.tripMap.saved}</p>}

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? t.common.saving : t.common.save}
      </Button>
    </div>
  );
}
