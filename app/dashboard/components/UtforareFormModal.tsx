"use client";

import { useState } from "react";
import { Input } from "../../_components/Input";
import { Label } from "../../_components/Label";
import type { Utforare } from "../../_server/db/schema/utforare";

interface UtforareFormData {
  namn: string;
  email: string;
  telefon: string;
  beskrivning: string;
  bildUrl: string;
  aktiv: boolean;
}

interface UtforareFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UtforareFormData) => void;
  utforare?: Utforare;
  isLoading: boolean;
}

export function UtforareFormModal({
  isOpen,
  onClose,
  onSubmit,
  utforare,
  isLoading,
}: UtforareFormModalProps) {
  const [formData, setFormData] = useState<UtforareFormData>(() => {
    if (utforare) {
      return {
        namn: utforare.namn,
        email: utforare.email || "",
        telefon: utforare.telefon || "",
        beskrivning: utforare.beskrivning || "",
        bildUrl: utforare.bildUrl || "",
        aktiv: utforare.aktiv,
      };
    }
    return {
      namn: "",
      email: "",
      telefon: "",
      beskrivning: "",
      bildUrl: "",
      aktiv: true,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submit
    if (!utforare) {
      setFormData({
        namn: "",
        email: "",
        telefon: "",
        beskrivning: "",
        bildUrl: "",
        aktiv: true,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">
          {utforare ? "Redigera utförare" : "Lägg till utförare"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="namn">Namn *</Label>
            <Input
              id="namn"
              value={formData.namn}
              onChange={(e) => setFormData({ ...formData, namn: e.target.value })}
              required
              className="bg-background"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-background"
            />
          </div>

          <div>
            <Label htmlFor="telefon">Telefon</Label>
            <Input
              id="telefon"
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              className="bg-background"
            />
          </div>

          <div>
            <Label htmlFor="beskrivning">Beskrivning</Label>
            <textarea
              id="beskrivning"
              value={formData.beskrivning}
              onChange={(e) => setFormData({ ...formData, beskrivning: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="bildUrl">Bild URL</Label>
            <Input
              id="bildUrl"
              type="url"
              value={formData.bildUrl}
              onChange={(e) => setFormData({ ...formData, bildUrl: e.target.value })}
              placeholder="https://..."
              className="bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="aktiv"
              checked={formData.aktiv}
              onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="aktiv" className="cursor-pointer">
              Aktiv
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
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
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Sparar..." : utforare ? "Uppdatera" : "Skapa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
