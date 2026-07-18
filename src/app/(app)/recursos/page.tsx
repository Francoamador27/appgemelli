"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage, isNotFoundError } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ResourceForm from "@/components/resources/ResourceForm";
import ResourceListItem from "@/components/resources/ResourceListItem";
import type { Resource } from "@/types/resource";

export default function RecursosPage() {
  const { t } = useLocale();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(
    null,
  );

  async function loadResources() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/resources");
      setResources(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    loadResources();
  }, []);

  function openCreate() {
    setEditingResource(null);
    setShowForm(true);
  }

  function openEdit(resource: Resource) {
    setEditingResource(resource);
    setShowForm(true);
  }

  function handleSaved() {
    setShowForm(false);
    loadResources();
  }

  async function handleDelete() {
    if (!deletingResource) return;
    try {
      await api.delete(`/resources/${deletingResource.id}`);
    } catch (err) {
      if (!isNotFoundError(err)) {
        setError(getErrorMessage(err));
        setDeletingResource(null);
        return;
      }
    }
    setDeletingResource(null);
    loadResources();
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">
          {t.resource.menuTitle} ({resources.length})
        </h1>
        <Button onClick={openCreate}>{t.resource.add}</Button>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">{t.common.loading}</p>
      ) : resources.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">
          {t.resource.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {resources.map((resource) => (
            <ResourceListItem
              key={resource.id}
              resource={resource}
              onEdit={() => openEdit(resource)}
              onDelete={() => setDeletingResource(resource)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ResourceForm
          resource={editingResource ?? undefined}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {deletingResource && (
        <ConfirmDialog
          message={t.resource.deleteConfirm.replace(
            "{name}",
            deletingResource.title_it,
          )}
          onConfirm={handleDelete}
          onCancel={() => setDeletingResource(null)}
        />
      )}
    </div>
  );
}
