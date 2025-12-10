"use client";

import { Trash2 } from "lucide-react";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";
import { useRedigeraBokning } from "../hooks/useRedigeraBokning";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../_components/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../_components/AlertDialog";

interface RedigeraBokningModalProps {
  isOpen: boolean;
  onClose: () => void;
  bokning: Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null };
  tjanster: Tjanst[];
  utforare: Utforare[];
  onUpdate: () => void;
}

export function RedigeraBokningModal({
  isOpen,
  onClose,
  bokning,
  tjanster,
  utforare,
  onUpdate,
}: RedigeraBokningModalProps) {
  const { isPending, isDeleting, error, formAction, handleDelete, defaultValues } =
    useRedigeraBokning({ bokning, onSuccess: onUpdate, onClose });

  const selectedTjanst = tjanster.find((t) => t.id === defaultValues.tjanstId);
  const varaktighet = selectedTjanst?.varaktighet || 60;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal">Redigera bokning</DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Vänster kolumn - Kunduppgifter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-stone-900">Kunduppgifter</h3>

              <div>
                <label
                  htmlFor="kundNamn"
                  className="block text-sm font-semibold text-stone-700 mb-1"
                >
                  Namn *
                </label>
                <input
                  type="text"
                  id="kundNamn"
                  name="kundNamn"
                  required
                  defaultValue={defaultValues.kundNamn}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="kundEmail"
                  className="block text-sm font-semibold text-stone-700 mb-1"
                >
                  E-post *
                </label>
                <input
                  type="email"
                  id="kundEmail"
                  name="kundEmail"
                  required
                  defaultValue={defaultValues.kundEmail}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="kundTelefon"
                  className="block text-sm font-semibold text-stone-700 mb-1"
                >
                  Telefon
                </label>
                <input
                  type="tel"
                  id="kundTelefon"
                  name="kundTelefon"
                  defaultValue={defaultValues.kundTelefon}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Höger kolumn - Bokningsdetaljer */}
            <div className="space-y-3">
              <h3 className="font-semibold text-stone-900">Bokningsdetaljer</h3>

              <div>
                <label htmlFor="tjanst" className="block text-sm font-semibold text-stone-700 mb-1">
                  Tjänst *
                </label>
                <select
                  id="tjanst"
                  name="tjanstId"
                  required
                  defaultValue={defaultValues.tjanstId}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {tjanster.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.namn} ({t.varaktighet} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="utforare"
                  className="block text-sm font-semibold text-stone-700 mb-1"
                >
                  Utförare *
                </label>
                <select
                  id="utforare"
                  name="utforareId"
                  required
                  defaultValue={defaultValues.utforareId}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Välj utförare</option>
                  {utforare.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.namn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="startTid"
                  className="block text-sm font-semibold text-stone-700 mb-1"
                >
                  Tid *
                </label>
                <input
                  type="datetime-local"
                  id="startTid"
                  name="startTid"
                  required
                  defaultValue={defaultValues.startTid}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <p className="text-xs text-stone-500 mt-1">Varaktighet: {varaktighet} minuter</p>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-stone-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  defaultValue={defaultValues.status}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="Väntande">Väntande</option>
                  <option value="Bekräftad">Bekräftad</option>
                  <option value="Inställd">Inställd</option>
                  <option value="Slutförd">Slutförd</option>
                </select>
              </div>
            </div>

            {/* Anteckningar - full bredd över båda kolumner */}
            <div className="col-span-2">
              <label
                htmlFor="anteckningar"
                className="block text-sm font-semibold text-stone-700 mb-1"
              >
                Anteckningar
              </label>
              <textarea
                id="anteckningar"
                name="anteckningar"
                defaultValue={defaultValues.anteckningar}
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-stone-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Radera
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Radera bokning?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Detta går inte att ångra. Bokningen kommer att raderas permanent.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Raderar..." : "Radera"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex-1 flex gap-3">
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
                {isPending ? "Sparar..." : "Spara ändringar"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
