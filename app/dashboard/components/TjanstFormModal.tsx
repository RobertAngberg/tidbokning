"use client";

import { useActionState, useEffect } from "react";
import { Input } from "../../_components/Input";
import { Label } from "../../_components/Label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../_components/Dialog";
import { Button } from "../../_components/Button";
import type { Tjanst } from "../../_server/db/schema/tjanster";

interface TjanstFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tjanst?: Tjanst;
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export function TjanstFormModal({ isOpen, onClose, tjanst, action }: TjanstFormModalProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  // Stäng modal vid success
  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tjanst ? "Redigera tjänst" : "Lägg till tjänst"}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {tjanst && <input type="hidden" name="id" value={tjanst.id} />}

          <div>
            <Label htmlFor="namn">Namn *</Label>
            <Input
              id="namn"
              name="namn"
              defaultValue={tjanst?.namn}
              required
              placeholder="T.ex. Svensk massage"
            />
          </div>

          <div>
            <Label htmlFor="beskrivning">Beskrivning</Label>
            <textarea
              id="beskrivning"
              name="beskrivning"
              defaultValue={tjanst?.beskrivning || ""}
              className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-foreground"
              placeholder="Beskriv tjänsten..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="varaktighet">Varaktighet (minuter) *</Label>
              <Input
                id="varaktighet"
                name="varaktighet"
                type="number"
                min="1"
                max="180"
                step="5"
                defaultValue={tjanst?.varaktighet || 60}
                required
                placeholder="60"
              />
            </div>

            <div>
              <Label htmlFor="pris">Pris (SEK) *</Label>
              <Input
                id="pris"
                name="pris"
                type="number"
                min="0"
                step="1"
                defaultValue={tjanst ? tjanst.pris / 100 : 0}
                required
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="kategori">Kategori</Label>
            <Input
              id="kategori"
              name="kategori"
              defaultValue={tjanst?.kategori || ""}
              placeholder="T.ex. Massage, Ansiktsbehandling"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="aktiv"
              name="aktiv"
              type="checkbox"
              defaultChecked={tjanst ? tjanst.aktiv === 1 : true}
              className="w-4 h-4"
            />
            <Label htmlFor="aktiv" className="cursor-pointer">
              Aktiv (visas för kunder)
            </Label>
          </div>

          {state?.error && <div className="text-red-500 text-sm">{state.error}</div>}

          <div className="flex gap-3 pt-4">
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
              {isPending ? "Sparar..." : tjanst ? "Uppdatera" : "Lägg till"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
