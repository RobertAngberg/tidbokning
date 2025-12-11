"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../_components/Input";
import { Label } from "../../../_components/Label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../_components/Dialog";
import { Button } from "../../../_components/Button";
import { BildUppladdare } from "../../bilder/components/BildUppladdare";
import type { Utforare } from "../../../_server/db/schema/utforare";
import type { UtforareTillganglighet } from "../../../_server/db/schema/utforare-tillganglighet";

const VECKODAGAR = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];

interface UtforareFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  utforare?: Utforare;
  tillganglighet?: UtforareTillganglighet[];
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export function UtforareFormModal({
  isOpen,
  onClose,
  utforare,
  tillganglighet,
  action,
}: UtforareFormModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [bildUrl, setBildUrl] = useState(utforare?.bildUrl || "");

  // Track only user changes, not the base data
  const [userChanges, setUserChanges] = useState<{
    [key: string]: { ledig: boolean; startTid: string; slutTid: string };
  }>({});

  // Derive arbetstider from tillganglighet prop + user changes
  const arbetstider = useMemo(() => {
    const base: { [key: string]: { ledig: boolean; startTid: string; slutTid: string } } = {};
    VECKODAGAR.forEach((dag) => {
      const befintlig = tillganglighet?.find((t) => t.veckodag === dag);
      const isWeekend = dag === "lördag" || dag === "söndag";
      base[dag] = {
        ledig: befintlig?.ledig ?? isWeekend,
        startTid: befintlig?.startTid?.substring(0, 5) ?? "08:00",
        slutTid: befintlig?.slutTid?.substring(0, 5) ?? "17:00",
      };
    });
    // Apply user changes on top of base data
    return { ...base, ...userChanges };
  }, [tillganglighet, userChanges]);

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      const result = await action(null, formData);

      if (result.success) {
        setUserChanges({}); // Reset user changes on successful save
        onClose();
        router.refresh();
      } else {
        setError(result.error || "Ett fel uppstod");
      }
    });
  };

  const handleClose = () => {
    setUserChanges({}); // Reset user changes when closing
    onClose();
  };

  return (
    <Dialog
      key={utforare?.id || "new"}
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{utforare ? "Redigera utförare" : "Lägg till utförare"}</DialogTitle>
        </DialogHeader>

        <form key={utforare?.id || "new"} action={handleSubmit} className="space-y-4">
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
            <Label htmlFor="telefon">Telefon (Valfritt)</Label>
            <Input
              id="telefon"
              name="telefon"
              defaultValue={utforare?.telefon || ""}
              className="bg-background"
            />
          </div>

          <div>
            <Label htmlFor="beskrivning">Beskrivning (Valfritt)</Label>
            <textarea
              id="beskrivning"
              name="beskrivning"
              defaultValue={utforare?.beskrivning || ""}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <BildUppladdare
              nuvarandeBildUrl={utforare?.bildUrl || undefined}
              onUppladdningsKlar={(url) => setBildUrl(url)}
              label="Profilbild (Valfritt)"
              beskrivning="PNG, JPG eller GIF (max 5MB)"
            />
            <input type="hidden" name="bildUrl" value={bildUrl} />
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

          {/* Arbetstider sektion */}
          <div className="border-t border-stone-200 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Arbetstider</h3>
            <div className="space-y-3">
              {VECKODAGAR.map((dag) => (
                <div
                  key={dag}
                  className="flex items-center gap-3 pb-3 border-b border-stone-100 last:border-0"
                >
                  <div className="w-20 text-sm font-medium text-stone-700 capitalize">{dag}</div>
                  <input
                    type="checkbox"
                    checked={!arbetstider[dag].ledig}
                    onChange={(e) => {
                      setUserChanges({
                        ...userChanges,
                        [dag]: { ...arbetstider[dag], ledig: !e.target.checked },
                      });
                    }}
                    className="w-4 h-4"
                  />
                  {!arbetstider[dag].ledig && (
                    <>
                      <input
                        type="time"
                        value={arbetstider[dag].startTid}
                        onChange={(e) => {
                          setUserChanges({
                            ...userChanges,
                            [dag]: { ...arbetstider[dag], startTid: e.target.value },
                          });
                        }}
                        className="px-2 py-1 text-sm border border-stone-300 rounded"
                      />
                      <span className="text-stone-500">-</span>
                      <input
                        type="time"
                        value={arbetstider[dag].slutTid}
                        onChange={(e) => {
                          setUserChanges({
                            ...userChanges,
                            [dag]: { ...arbetstider[dag], slutTid: e.target.value },
                          });
                        }}
                        className="px-2 py-1 text-sm border border-stone-300 rounded"
                      />
                    </>
                  )}
                  {arbetstider[dag].ledig && (
                    <span className="text-sm text-stone-400 italic">Ledig</span>
                  )}
                </div>
              ))}
            </div>
            {/* Hidden inputs för arbetstider */}
            <input type="hidden" name="arbetstider" value={JSON.stringify(arbetstider)} />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              onClick={handleClose}
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
