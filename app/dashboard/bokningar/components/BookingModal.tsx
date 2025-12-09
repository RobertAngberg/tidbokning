"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTime: string;
  tjanst: Tjanst;
  utforare: Utforare[];
  onSubmit: (data: BookingFormData) => Promise<void>;
}

export interface BookingFormData {
  namn: string;
  email: string;
  telefon: string;
  utforareId: string;
  anteckningar?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  tjanst,
  utforare,
  onSubmit,
}: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    namn: "",
    email: "",
    telefon: "",
    utforareId: utforare[0]?.id || "",
    anteckningar: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        namn: "",
        email: "",
        telefon: "",
        utforareId: utforare[0]?.id || "",
        anteckningar: "",
      });
    } catch (error) {
      console.error("Fel vid bokning:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = () => {
    return selectedDate.toLocaleDateString("sv-SE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Boka tid</h2>
            <p className="text-xs text-stone-600 mt-0.5">
              {formatDate()} • {selectedTime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tjänst info */}
        <div className="p-4 bg-amber-50 border-b border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-800">{tjanst.namn}</h3>
              <p className="text-sm text-stone-600 mt-1">
                {tjanst.varaktighet} minuter • {tjanst.pris / 100} kr
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Namn */}
          <div>
            <label htmlFor="namn" className="block text-sm font-semibold text-stone-700 mb-1">
              Namn *
            </label>
            <input
              type="text"
              id="namn"
              required
              value={formData.namn}
              onChange={(e) => setFormData({ ...formData, namn: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ditt fullständiga namn"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-1">
              E-post *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="din@email.se"
            />
          </div>

          {/* Telefon */}
          <div>
            <label htmlFor="telefon" className="block text-sm font-semibold text-stone-700 mb-1">
              Telefon *
            </label>
            <input
              type="tel"
              id="telefon"
              required
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="070-123 45 67"
            />
          </div>

          {/* Utförare */}
          {utforare.length > 0 && (
            <div>
              <label htmlFor="utforare" className="block text-sm font-semibold text-stone-700 mb-1">
                Välj utförare *
              </label>
              <select
                id="utforare"
                required
                value={formData.utforareId}
                onChange={(e) => setFormData({ ...formData, utforareId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {utforare.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.namn}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Anteckningar */}
          <div>
            <label
              htmlFor="anteckningar"
              className="block text-sm font-semibold text-stone-700 mb-1"
            >
              Anteckningar (valfritt)
            </label>
            <textarea
              id="anteckningar"
              value={formData.anteckningar}
              onChange={(e) => setFormData({ ...formData, anteckningar: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Eventuella önskemål eller information..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-50 transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Bokar..." : "Bekräfta bokning"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
