"use client";

import { FormEvent, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage, isNotFoundError } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Sheet from "@/components/ui/Sheet";
import { inputClass } from "@/components/ui/input-styles";
import type { UsageGuide } from "@/types/usageGuide";

export default function UsageGuideForm({
  guide,
  onClose,
  onSaved,
}: {
  guide?: UsageGuide;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [title, setTitle] = useState(guide?.title ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    if (file) formData.append("file", file);

    try {
      if (guide) {
        formData.append("_method", "PUT");
        await api.post(`/usage-guides/${guide.id}`, formData);
      } else {
        await api.post("/usage-guides", formData);
      }
      onSaved();
    } catch (err) {
      if (guide && isNotFoundError(err)) {
        onSaved();
        return;
      }
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet
      title={guide ? t.usageGuide.editTitle : t.usageGuide.newTitle}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label={t.usageGuide.titleLabel}>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.usageGuide.titlePlaceholder}
            className={inputClass}
          />
        </Field>

        <Field
          label={guide ? t.usageGuide.fileLabelOptional : t.usageGuide.fileLabel}
        >
          <input
            type="file"
            accept="application/pdf"
            required={!guide}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className={inputClass}
          />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? t.common.saving : t.common.save}
        </Button>
      </form>
    </Sheet>
  );
}
