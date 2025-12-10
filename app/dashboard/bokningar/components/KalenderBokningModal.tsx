"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../_components/Dialog";
import { Input } from "../../../_components/Input";
import { Label } from "../../../_components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../_components/Select";
import { Button } from "../../../_components/Button";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";
import { useKalenderBokning } from "../hooks/useKalenderBokning";

interface KalenderBokningModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTime: string;
  tjanster: Tjanst[];
  utforare: Utforare[];
  onSuccess?: () => void;
}

function TjanstSelect({ tjanster }: { tjanster: Tjanst[] }) {
  const [value, setValue] = useState("");

  return (
    <div>
      <input type="hidden" name="tjänstId" value={value} />
      <Label htmlFor="tjänst">Tjänst *</Label>
      <Select value={value} onValueChange={setValue} required>
        <SelectTrigger>
          <SelectValue placeholder="Välj tjänst" />
        </SelectTrigger>
        <SelectContent>
          {tjanster.map((tjanst) => (
            <SelectItem key={tjanst.id} value={tjanst.id}>
              {tjanst.namn} - {tjanst.pris / 100} kr ({tjanst.varaktighet} min)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function UtforareSelect({ utforare }: { utforare: Utforare[] }) {
  const [value, setValue] = useState("");

  return (
    <div>
      <input type="hidden" name="utforareId" value={value} />
      <Label htmlFor="utforare">Utförare (valfritt)</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Välj utförare" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Ingen specifik utförare</SelectItem>
          {utforare.map((utf) => (
            <SelectItem key={utf.id} value={utf.id}>
              {utf.namn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function KalenderBokningModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  tjanster,
  utforare,
  onSuccess,
}: KalenderBokningModalProps) {
  const { isPending, error, formAction } = useKalenderBokning({
    selectedDate,
    selectedTime,
    onSuccess,
    onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal">
            Skapa bokning -{" "}
            {selectedDate.toLocaleDateString("sv-SE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            kl. {selectedTime}
          </DialogTitle>
        </DialogHeader>
        <hr className="border-stone-200" />
        <form action={formAction} className="space-y-4">
          {/* Kunduppgifter */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="font-semibold text-stone-900">Kunduppgifter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kundNamn">Namn *</Label>
                <Input
                  id="kundNamn"
                  name="kundNamn"
                  required
                  placeholder="Kundens namn"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="kundEmail">E-post *</Label>
                <Input
                  id="kundEmail"
                  name="kundEmail"
                  type="email"
                  required
                  placeholder="kund@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="kundTelefon">
                Telefon <span className="text-stone-500 font-normal">(valfritt)</span>
              </Label>
              <Input id="kundTelefon" name="kundTelefon" type="tel" placeholder="070-123 45 67" />
            </div>
          </div>

          {/* Bokningsdetaljer */}
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-900">Bokningsdetaljer</h3>
            <TjanstSelect tjanster={tjanster} />
            {utforare.length > 0 && <UtforareSelect utforare={utforare} />}

            <div>
              <Label htmlFor="anteckningar">Anteckningar (valfritt)</Label>
              <textarea
                id="anteckningar"
                name="anteckningar"
                placeholder="Eventuella anteckningar om bokningen..."
                rows={3}
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isPending ? "Skapar..." : "Skapa bokning"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-stone-300">
              Avbryt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
