"use client";

import { useState } from "react";
import { Input } from "../../_components/Input";
import { Label } from "../../_components/Label";
import type { Personal } from "../../_server/db/schema/personal";

interface PersonalFormData {
  namn: string;
  email: string;
  telefon: string;
  bio: string;
  profilbildUrl: string;
  aktiv: boolean;
}

interface PersonalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalFormData) => void;
  personal?: Personal;
  isLoading: boolean;
}

export function PersonalFormModal({
  isOpen,
  onClose,
  onSubmit,
  personal,
  isLoading,
}: PersonalFormModalProps) {
  const [formData, setFormData] = useState<PersonalFormData>(() => {
    if (personal) {
      return {
        namn: personal.namn,
        email: personal.email,
        telefon: personal.telefon || "",
        bio: personal.bio || "",
        profilbildUrl: personal.profilbildUrl || "",
        aktiv: personal.aktiv === 1,
      };
    }
    return {
      namn: "",
      email: "",
      telefon: "",
      bio: "",
      profilbildUrl: "",
      aktiv: true,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submit
    if (!personal) {
      setFormData({
        namn: "",
        email: "",
        telefon: "",
        bio: "",
        profilbildUrl: "",
        aktiv: true,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">
          {personal ? "Redigera medarbetare" : "Lägg till medarbetare"}
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
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="profilbildUrl">Profilbild URL</Label>
            <Input
              id="profilbildUrl"
              type="url"
              value={formData.profilbildUrl}
              onChange={(e) => setFormData({ ...formData, profilbildUrl: e.target.value })}
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
              {isLoading ? "Sparar..." : personal ? "Uppdatera" : "Skapa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
