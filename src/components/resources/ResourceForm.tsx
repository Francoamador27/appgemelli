"use client";

import { FormEvent, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage, isNotFoundError } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Sheet from "@/components/ui/Sheet";
import { inputClass } from "@/components/ui/input-styles";
import type { Resource, ResourceType } from "@/types/resource";

export default function ResourceForm({
  resource,
  onClose,
  onSaved,
}: {
  resource?: Resource;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [type, setType] = useState<ResourceType>(resource?.type ?? "link");
  const [titleEn, setTitleEn] = useState(resource?.title_en ?? "");
  const [titleIt, setTitleIt] = useState(resource?.title_it ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    resource?.description_en ?? "",
  );
  const [descriptionIt, setDescriptionIt] = useState(
    resource?.description_it ?? "",
  );
  const [url, setUrl] = useState(resource?.url ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("type", type);
    formData.append("title_en", titleEn);
    formData.append("title_it", titleIt);
    formData.append("description_en", descriptionEn);
    formData.append("description_it", descriptionIt);
    if (type === "link") formData.append("url", url);
    if (file) formData.append("resource_file", file);

    try {
      if (resource) {
        formData.append("_method", "PUT");
        await api.post(`/resources/${resource.id}`, formData);
      } else {
        await api.post("/resources", formData);
      }
      onSaved();
    } catch (err) {
      if (resource && isNotFoundError(err)) {
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
      title={resource ? t.resource.editTitle : t.resource.newTitle}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label={t.resource.typeLabel}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ResourceType)}
            className={inputClass}
          >
            <option value="link">{t.resource.typeLink}</option>
            <option value="image">{t.resource.typeImage}</option>
            <option value="file">{t.resource.typeFile}</option>
          </select>
        </Field>

        <Field label={t.resource.titleEnLabel}>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.resource.titleItLabel}>
          <input
            required
            value={titleIt}
            onChange={(e) => setTitleIt(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.resource.descriptionEnLabel}>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </Field>
        <Field label={t.resource.descriptionItLabel}>
          <textarea
            value={descriptionIt}
            onChange={(e) => setDescriptionIt(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </Field>

        {type === "link" ? (
          <Field label={t.resource.urlLabel}>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputClass}
            />
          </Field>
        ) : (
          <Field
            label={
              resource ? t.resource.fileLabelOptional : t.resource.fileLabel
            }
          >
            <input
              type="file"
              accept={type === "image" ? "image/*" : undefined}
              required={!resource}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className={inputClass}
            />
          </Field>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? t.common.saving : t.common.save}
        </Button>
      </form>
    </Sheet>
  );
}
