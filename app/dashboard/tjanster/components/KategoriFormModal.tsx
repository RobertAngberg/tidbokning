"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../_components/Input";
import { Label } from "../../../_components/Label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../_components/Dialog";
import { Button } from "../../../_components/Button";
import type { Kategori } from "../../../_server/db/schema/kategorier";

interface KategoriFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  kategori?: Kategori;
  foretagsslug: string;
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export function KategoriFormModal({
  isOpen,
  onClose,
  kategori,
  foretagsslug,
  action,
}: KategoriFormModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setIsPending(true);

    const result = await action(null, formData);

    if (result.success) {
      onClose();
      router.refresh();
    } else {
      setError(result.error || "Ett fel uppstod");
    }

    setIsPending(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{kategori ? "Redigera kategori" : "Lägg till kategori"}</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {kategori && <input type="hidden" name="id" value={kategori.id} />}
          <input type="hidden" name="foretagsslug" value={foretagsslug} />

          <div>
            <Label htmlFor="namn">Namn *</Label>
            <Input
              id="namn"
              name="namn"
              defaultValue={kategori?.namn}
              required
              className="bg-background"
            />
          </div>

          {kategori && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="aktiv"
                name="aktiv"
                defaultChecked={kategori.aktiv === 1}
                className="w-4 h-4"
              />
              <Label htmlFor="aktiv" className="cursor-pointer">
                Aktiv
              </Label>
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isPending}
            >
              Avbryt
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending
                ? kategori
                  ? "Sparar..."
                  : "Lägger till..."
                : kategori
                ? "Uppdatera"
                : "Lägg till"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
