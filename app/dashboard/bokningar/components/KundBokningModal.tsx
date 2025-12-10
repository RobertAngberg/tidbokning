"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../_components/Dialog";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";
import { useKundBokning } from "../hooks/useKundBokning";

export interface BookingFormData {
  namn: string;
  email: string;
  telefon: string;
  utforareId: string;
  anteckningar?: string;
}

interface KundBokningModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTime: string;
  tjanst: Tjanst;
  utforare: Utforare[];
  onSuccess?: () => void;
}

export function KundBokningModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  tjanst,
  utforare,
  onSuccess,
}: KundBokningModalProps) {
  const { isPending, error, formAction } = useKundBokning({
    selectedDate,
    selectedTime,
    tjänstId: tjanst.id,
    onSuccess,
    onClose,
  });

  const formatDate = () => {
    return selectedDate.toLocaleDateString("sv-SE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl font-normal">Boka tid</DialogTitle>
          <p className="text-base text-stone-600 mt-1">
            {formatDate()} • {selectedTime}
          </p>
        </DialogHeader>
        <hr className="border-stone-200" />

        {/* Tjänst info */}
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg -mt-2">
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
        <form action={formAction} className="space-y-3">
          {/* Namn */}
          <div>
            <label htmlFor="namn" className="block text-sm font-semibold text-stone-700 mb-1">
              Namn *
            </label>
            <input
              type="text"
              id="namn"
              name="namn"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ditt fullständiga namn"
              autoFocus
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
              name="email"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="din@email.se"
            />
          </div>

          {/* Telefon */}
          <div>
            <label htmlFor="telefon" className="block text-sm font-semibold text-stone-700 mb-1">
              Telefon <span className="text-stone-500 font-normal">(valfritt)</span>
            </label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="070-123 45 67"
            />
          </div>

          {/* Utförare */}
          {utforare.length > 0 && (
            <div>
              <label htmlFor="utforare" className="block text-sm font-semibold text-stone-700 mb-1">
                Välj utförare (valfritt)
              </label>
              <select
                id="utforare"
                name="utforareId"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Valfri utförare</option>
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
              name="anteckningar"
              rows={2}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Eventuella önskemål eller information..."
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200 text-sm">
              {error}
            </div>
          )}

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
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Bokar..." : "Bekräfta bokning"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
