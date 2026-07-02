"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import Button from "./Button";

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmLabel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}) {
  const { t } = useLocale();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label={t.common.close}
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />
      <div className="relative z-10 w-[90%] max-w-sm rounded-2xl bg-white p-5">
        <p className="mb-4 text-sm text-zinc-700">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {t.common.cancel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel ?? t.common.delete}
          </Button>
        </div>
      </div>
    </div>
  );
}
