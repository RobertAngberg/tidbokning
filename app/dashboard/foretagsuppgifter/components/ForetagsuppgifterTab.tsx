"use client";

import { Card } from "../../../_components/Card";
import { Label } from "../../../_components/Label";
import { Input } from "../../../_components/Input";
import { Button } from "../../../_components/Button";
import { uppdateraForetagAction, skapaForetagAction } from "../actions/foretag";
import { BildUppladdare } from "../../bilder/components/BildUppladdare";
import { useForetagsuppgifter } from "../hooks/useForetagsuppgifter";
import type { Foretag } from "../../../_server/db/schema/foretag";

interface ForetagsuppgifterTabProps {
  foretag: Foretag | null;
}

export function ForetagsuppgifterTab({ foretag }: ForetagsuppgifterTabProps) {
  const action = foretag ? uppdateraForetagAction : skapaForetagAction;

  const { logoUrl, isLoggingOut, state, isPending, formAction, handleLogoUpload, handleLoggaUt } =
    useForetagsuppgifter({ foretag, action });

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        {foretag && <input type="hidden" name="id" value={foretag.id} />}

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Företagsinformation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="namn">Företagsnamn *</Label>
              <Input id="namn" name="namn" defaultValue={foretag?.namn} required />
            </div>

            {/* Bilduppladdare för logotyp */}
            <div className="md:col-span-3">
              <BildUppladdare
                nuvarandeBildUrl={foretag?.logoUrl || undefined}
                onUppladdningsKlar={handleLogoUpload}
                label="Företagslogotyp"
                beskrivning="PNG, JPG eller GIF (max 5MB)"
              />
              <input type="hidden" name="logoUrl" value={logoUrl} />
            </div>

            <div>
              <Label htmlFor="adress">Adress</Label>
              <Input id="adress" name="adress" defaultValue={foretag?.adress || ""} />
            </div>
            <div>
              <Label htmlFor="postnummer">Postnummer</Label>
              <Input id="postnummer" name="postnummer" defaultValue={foretag?.postnummer || ""} />
            </div>
            <div>
              <Label htmlFor="stad">Stad</Label>
              <Input id="stad" name="stad" defaultValue={foretag?.stad || ""} />
            </div>
            <div>
              <Label htmlFor="telefon">Telefon</Label>
              <Input id="telefon" name="telefon" defaultValue={foretag?.telefon || ""} />
            </div>
            <div>
              <Label htmlFor="email">E-post</Label>
              <Input id="email" name="email" type="email" defaultValue={foretag?.email || ""} />
            </div>
            <div>
              <Label htmlFor="webbplats">Webbplats</Label>
              <Input
                id="webbplats"
                name="webbplats"
                defaultValue={foretag?.webbplats || ""}
                placeholder="www.example.com"
              />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="beskrivning">Beskrivning</Label>
              <textarea
                id="beskrivning"
                name="beskrivning"
                defaultValue={foretag?.beskrivning || ""}
                className="w-full px-3 py-2 rounded-md border bg-background text-foreground min-h-[100px]"
              />
            </div>
          </div>

          {state?.error && <div className="text-red-500 text-sm">{state.error}</div>}

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sparar..." : "Spara ändringar"}
            </Button>
            <Button
              type="button"
              onClick={handleLoggaUt}
              disabled={isLoggingOut}
              variant="outline"
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
            >
              {isLoggingOut ? "Loggar ut..." : "Logga ut"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
