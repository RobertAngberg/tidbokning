"use client";

import { useState } from "react";
import { Input } from "../../_components/Input";
import { Label } from "../../_components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../_components/Select";
import type { Tjanst } from "../../_server/db/schema/tjanster";

interface TjanstFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    namn: string;
    beskrivning: string;
    varaktighet: number;
    pris: number;
    kategori: string;
    aktiv: boolean;
  }) => void;
  tjanst?: Tjanst;
  isLoading?: boolean;
}

export function TjanstFormModal({
  isOpen,
  onClose,
  onSubmit,
  tjanst,
  isLoading,
}: TjanstFormModalProps) {
  const [formData, setFormData] = useState({
    namn: "",
    beskrivning: "",
    varaktighet: 60,
    pris: 0,
    kategori: "",
    aktiv: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      pris: formData.pris * 100, // Konvertera till ören
    });
    // Reset form efter submit
    setFormData({
      namn: "",
      beskrivning: "",
      varaktighet: 60,
      pris: 0,
      kategori: "",
      aktiv: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {tjanst ? "Redigera tjänst" : "Lägg till tjänst"}
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              type="button"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="namn">Namn *</Label>
              <Input
                id="namn"
                value={formData.namn}
                onChange={(e) => setFormData({ ...formData, namn: e.target.value })}
                required
                placeholder="T.ex. Svensk massage"
              />
            </div>

            <div>
              <Label htmlFor="beskrivning">Beskrivning</Label>
              <textarea
                id="beskrivning"
                value={formData.beskrivning}
                onChange={(e) => setFormData({ ...formData, beskrivning: e.target.value })}
                className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-foreground"
                placeholder="Beskriv tjänsten..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="varaktighet">Varaktighet *</Label>
                <Select
                  value={formData.varaktighet.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, varaktighet: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minuter</SelectItem>
                    <SelectItem value="30">30 minuter</SelectItem>
                    <SelectItem value="45">45 minuter</SelectItem>
                    <SelectItem value="60">60 minuter</SelectItem>
                    <SelectItem value="90">90 minuter</SelectItem>
                    <SelectItem value="120">120 minuter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pris">Pris (SEK) *</Label>
                <Input
                  id="pris"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.pris}
                  onChange={(e) =>
                    setFormData({ ...formData, pris: parseFloat(e.target.value) || 0 })
                  }
                  required
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="kategori">Kategori</Label>
              <Input
                id="kategori"
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                placeholder="T.ex. Massage, Ansiktsbehandling"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="aktiv"
                type="checkbox"
                checked={formData.aktiv}
                onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="aktiv" className="cursor-pointer">
                Aktiv (visas för kunder)
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-input rounded-md hover:bg-accent"
                disabled={isLoading}
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Sparar..." : tjanst ? "Uppdatera" : "Lägg till"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
