"use client";

import { useActionState, useEffect } from "react";
import { Input } from "../../_components/Input";
import { Label } from "../../_components/Label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../_components/Dialog";
import { Button } from "../../_components/Button";
import type { Utforare } from "../../_server/db/schema/utforare";

interface UtforareFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  utforare?: Utforare;
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export function UtforareFormModal({ isOpen, onClose, utforare, action }: UtforareFormModalProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  // Stäng modal vid success
  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{utforare ? "Redigera utförare" : "Lägg till utförare"}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {utforare && <input type="hidden" name="id" value={utforare.id} />}

          <div>
            <Label htmlFor="namn">Namn *</Label>
            <Input
              id="namn"
              name="namn"
              defaultValue={utforare?.namn}
              required
              className="bg-background"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={utforare?.email || ""}
              required
              className="bg-background"
            />
          </div>

          <div>
            <Label htmlFor="telefon">Telefon</Label>
            <Input
              id="telefon"
              name="telefon"
              defaultValue={utforare?.telefon || ""}
              className="bg-background"
            />
          </div>

          <div>
            <Label htmlFor="beskrivning">Beskrivning</Label>
            <textarea
              id="beskrivning"
              name="beskrivning"
              defaultValue={utforare?.beskrivning || ""}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="bildUrl">Bild URL</Label>
            <Input
              id="bildUrl"
              name="bildUrl"
              type="url"
              defaultValue={utforare?.bildUrl || ""}
              placeholder="https://..."
              className="bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="aktiv"
              name="aktiv"
              defaultChecked={utforare ? utforare.aktiv : true}
              className="w-4 h-4"
            />
            <Label htmlFor="aktiv" className="cursor-pointer">
              Aktiv
            </Label>
          </div>

          {state?.error && <div className="text-red-500 text-sm">{state.error}</div>}

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
              {isPending ? "Sparar..." : utforare ? "Uppdatera" : "Lägg till"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
