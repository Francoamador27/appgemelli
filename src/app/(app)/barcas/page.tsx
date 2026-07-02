"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getErrorMessage, isNotFoundError } from "@/lib/errors";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BoatForm from "@/components/boats/BoatForm";
import BoatCard from "@/components/boats/BoatCard";
import type { Boat } from "@/types/boat";

export default function BarcasPage() {
  const { t } = useLocale();
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingBoat, setDeletingBoat] = useState<Boat | null>(null);

  async function loadBoats() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/boats");
      setBoats(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    loadBoats();
  }, []);

  function openCreate() {
    setEditingBoat(null);
    setShowForm(true);
  }

  function openEdit(boat: Boat) {
    setEditingBoat(boat);
    setShowForm(true);
  }

  function handleSaved() {
    setShowForm(false);
    loadBoats();
  }

  async function handleDelete() {
    if (!deletingBoat) return;
    try {
      await api.delete(`/boats/${deletingBoat.id}`);
    } catch (err) {
      if (!isNotFoundError(err)) {
        setError(getErrorMessage(err));
        setDeletingBoat(null);
        return;
      }
    }
    setDeletingBoat(null);
    loadBoats();
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">
          {t.boat.fleetTitle} ({boats.length})
        </h1>
        <Button onClick={openCreate}>{t.boat.add}</Button>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">{t.common.loading}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {boats.map((boat) => (
            <BoatCard
              key={boat.id}
              boat={boat}
              onEdit={() => openEdit(boat)}
              onDelete={() => setDeletingBoat(boat)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <BoatForm
          boat={editingBoat ?? undefined}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {deletingBoat && (
        <ConfirmDialog
          message={t.boat.deleteConfirm.replace("{name}", deletingBoat.name)}
          onConfirm={handleDelete}
          onCancel={() => setDeletingBoat(null)}
        />
      )}
    </div>
  );
}
