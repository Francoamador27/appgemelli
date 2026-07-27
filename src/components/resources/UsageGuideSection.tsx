"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage, isNotFoundError } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import UsageGuideForm from "./UsageGuideForm";
import UsageGuideListItem from "./UsageGuideListItem";
import type { UsageGuide } from "@/types/usageGuide";

export default function UsageGuideSection() {
  const { t } = useLocale();
  const [guides, setGuides] = useState<UsageGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingGuide, setEditingGuide] = useState<UsageGuide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingGuide, setDeletingGuide] = useState<UsageGuide | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/usage-guides");
      setGuides(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    load();
  }, []);

  function openCreate() {
    setEditingGuide(null);
    setShowForm(true);
  }

  function openEdit(guide: UsageGuide) {
    setEditingGuide(guide);
    setShowForm(true);
  }

  function handleSaved() {
    setShowForm(false);
    load();
  }

  async function handleDelete() {
    if (!deletingGuide) return;
    try {
      await api.delete(`/usage-guides/${deletingGuide.id}`);
    } catch (err) {
      if (!isNotFoundError(err)) {
        setError(getErrorMessage(err));
        setDeletingGuide(null);
        return;
      }
    }
    setDeletingGuide(null);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">
          {t.usageGuide.menuTitle} ({guides.length})
        </h2>
        <Button onClick={openCreate}>{t.usageGuide.add}</Button>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">{t.common.loading}</p>
      ) : guides.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">
          {t.usageGuide.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {guides.map((guide) => (
            <UsageGuideListItem
              key={guide.id}
              guide={guide}
              onEdit={() => openEdit(guide)}
              onDelete={() => setDeletingGuide(guide)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <UsageGuideForm
          guide={editingGuide ?? undefined}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {deletingGuide && (
        <ConfirmDialog
          message={t.usageGuide.deleteConfirm.replace(
            "{title}",
            deletingGuide.title,
          )}
          onConfirm={handleDelete}
          onCancel={() => setDeletingGuide(null)}
        />
      )}
    </div>
  );
}
