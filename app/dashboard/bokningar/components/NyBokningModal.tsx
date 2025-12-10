"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../_components/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../_components/Dialog";
import { Input } from "../../../_components/Input";
import { Label } from "../../../_components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../_components/Select";
import { skapaBokning } from "../actions/bokningar";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";

interface NyBokningModalProps {
  tjanster: Tjanst[];
  utforare: Utforare[];
  onSuccess?: () => void;
}

export function NyBokningModal({ tjanster, utforare, onSuccess }: NyBokningModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kundNamn: "",
    kundEmail: "",
    kundTelefon: "",
    tjänstId: "",
    utforareId: "",
    datum: "",
    tid: "",
    anteckningar: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Kombinera datum och tid till Date object
    const [year, month, day] = formData.datum.split("-").map(Number);
    const [hours, minutes] = formData.tid.split(":").map(Number);
    const startTid = new Date(year, month - 1, day, hours, minutes);

    const result = await skapaBokning({
      kundNamn: formData.kundNamn,
      kundEmail: formData.kundEmail,
      kundTelefon: formData.kundTelefon,
      tjänstId: formData.tjänstId,
      utforareId: formData.utforareId || undefined,
      startTid,
      anteckningar: formData.anteckningar || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      setFormData({
        kundNamn: "",
        kundEmail: "",
        kundTelefon: "",
        tjänstId: "",
        utforareId: "",
        datum: "",
        tid: "",
        anteckningar: "",
      });
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } else {
      setError(result.error || "Något gick fel");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Ny bokning
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Skapa ny bokning</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kunduppgifter */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="font-semibold text-stone-900">Kunduppgifter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kundNamn">Namn *</Label>
                <Input
                  id="kundNamn"
                  value={formData.kundNamn}
                  onChange={(e) => setFormData({ ...formData, kundNamn: e.target.value })}
                  required
                  placeholder="Kundens namn"
                />
              </div>
              <div>
                <Label htmlFor="kundEmail">E-post *</Label>
                <Input
                  id="kundEmail"
                  type="email"
                  value={formData.kundEmail}
                  onChange={(e) => setFormData({ ...formData, kundEmail: e.target.value })}
                  required
                  placeholder="kund@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="kundTelefon">
                Telefon <span className="text-stone-500 font-normal">(valfritt)</span>
              </Label>
              <Input
                id="kundTelefon"
                type="tel"
                value={formData.kundTelefon}
                onChange={(e) => setFormData({ ...formData, kundTelefon: e.target.value })}
                placeholder="070-123 45 67"
              />
            </div>
          </div>

          {/* Bokningsdetaljer */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="font-semibold text-stone-900">Bokningsdetaljer</h3>
            <div>
              <Label htmlFor="tjänst">Tjänst *</Label>
              <Select
                value={formData.tjänstId}
                onValueChange={(value) => setFormData({ ...formData, tjänstId: value })}
              >
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

            {utforare.length > 0 && (
              <div>
                <Label htmlFor="utforare">Utförare (valfritt)</Label>
                <Select
                  value={formData.utforareId}
                  onValueChange={(value) => setFormData({ ...formData, utforareId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj utförare" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ingen specifik utförare</SelectItem>
                    {utforare.map((utf) => (
                      <SelectItem key={utf.id} value={utf.id}>
                        {utf.namn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="datum">Datum *</Label>
                <Input
                  id="datum"
                  type="date"
                  value={formData.datum}
                  onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tid">Tid *</Label>
                <Input
                  id="tid"
                  type="time"
                  value={formData.tid}
                  onChange={(e) => setFormData({ ...formData, tid: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Anteckningar */}
          <div>
            <Label htmlFor="anteckningar">Anteckningar (valfritt)</Label>
            <textarea
              id="anteckningar"
              value={formData.anteckningar}
              onChange={(e) => setFormData({ ...formData, anteckningar: e.target.value })}
              placeholder="Eventuella anteckningar om bokningen..."
              rows={3}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isSubmitting ? "Skapar..." : "Skapa bokning"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-stone-300"
            >
              Avbryt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
