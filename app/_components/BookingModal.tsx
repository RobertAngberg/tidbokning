"use client";

import { useState } from "react";
import Image from "next/image";
import type { Tjanst } from "../_server/db/schema/tjanster";
import type { Utforare } from "../_server/db/schema/utforare";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tjanst: Tjanst;
  utforare: Utforare[];
  selectedDate: Date | null;
  selectedTime: string | null;
}

export function BookingModal({
  isOpen,
  onClose,
  tjanst,
  utforare,
  selectedDate,
  selectedTime,
}: BookingModalProps) {
  const [selectedUtforare, setSelectedUtforare] = useState<string>("");
  const [kundNamn, setKundNamn] = useState("");
  const [kundEmail, setKundEmail] = useState("");
  const [kundTelefon, setKundTelefon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implementera server action för att skapa bokning
    console.log({
      tjanst: tjanst.id,
      utforare: selectedUtforare,
      datum: selectedDate,
      tid: selectedTime,
      kundNamn,
      kundEmail,
      kundTelefon,
    });

    // Stäng modal efter lyckad bokning
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 font-[family-name:var(--font-newsreader)]">
                Boka {tjanst.namn}
              </h2>
              {selectedDate && selectedTime && (
                <p className="text-sm text-stone-600 mt-1">
                  {selectedDate.toLocaleDateString("sv-SE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  kl. {selectedTime}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Utförare val */}
            {utforare.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Välj utförare *
                </label>
                <div className="space-y-2">
                  {utforare.map((u) => (
                    <label
                      key={u.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedUtforare === u.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-stone-200 hover:border-amber-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="utforare"
                        value={u.id}
                        checked={selectedUtforare === u.id}
                        onChange={(e) => setSelectedUtforare(e.target.value)}
                        className="text-amber-500 focus:ring-amber-500"
                        required
                      />
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                        {u.bildUrl && (
                          <Image src={u.bildUrl} alt={u.namn} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">{u.namn}</p>
                        {u.beskrivning && <p className="text-xs text-stone-600">{u.beskrivning}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Kunduppgifter */}
            <div>
              <label htmlFor="namn" className="block text-sm font-semibold text-stone-700 mb-2">
                Ditt namn *
              </label>
              <input
                type="text"
                id="namn"
                value={kundNamn}
                onChange={(e) => setKundNamn(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="För- och efternamn"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">
                E-post *
              </label>
              <input
                type="email"
                id="email"
                value={kundEmail}
                onChange={(e) => setKundEmail(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="din@email.se"
                required
              />
            </div>

            <div>
              <label htmlFor="telefon" className="block text-sm font-semibold text-stone-700 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                id="telefon"
                value={kundTelefon}
                onChange={(e) => setKundTelefon(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="070-123 45 67"
                required
              />
            </div>

            {/* Info box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-stone-700">
                  <p className="font-semibold mb-1">Viktigt att veta:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Bekräftelse skickas till din e-post</li>
                    <li>• Avbokning senast 24h innan</li>
                    <li>
                      • Pris: {tjanst.pris / 100} kr ({tjanst.varaktighet} min)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-semibold"
                disabled={isSubmitting}
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Bokar..." : "Bekräfta bokning"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
