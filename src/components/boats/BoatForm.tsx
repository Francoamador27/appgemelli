"use client";

import { FormEvent, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage, isNotFoundError } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Sheet from "@/components/ui/Sheet";
import { inputClass } from "@/components/ui/input-styles";
import type { Boat } from "@/types/boat";

export default function BoatForm({
  boat,
  onClose,
  onSaved,
}: {
  boat?: Boat;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [name, setName] = useState(boat?.name ?? "");
  const [type, setType] = useState(boat?.type ?? "");
  const [capacity, setCapacity] = useState(
    boat ? String(boat.capacity) : "",
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("capacity", capacity);
    if (photo) formData.append("photo", photo);

    try {
      if (boat) {
        formData.append("_method", "PUT");
        await api.post(`/boats/${boat.id}`, formData);
      } else {
        await api.post("/boats", formData);
      }
      onSaved();
    } catch (err) {
      if (boat && isNotFoundError(err)) {
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
      title={boat ? t.boat.editTitle : t.boat.newTitle}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label={t.boat.nameLabel}>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.boat.typeLabel}>
          <input
            required
            placeholder={t.boat.typePlaceholder}
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.boat.capacityLabel}>
          <input
            type="number"
            min={1}
            required
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.boat.photoLabel}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
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
