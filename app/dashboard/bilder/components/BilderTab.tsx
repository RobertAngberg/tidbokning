"use client";

import Image from "next/image";
import { Card } from "../../../_components/Card";
import { Button } from "../../../_components/Button";
import { useForetagBilder } from "../hooks/useForetagBilder";
import { Trash2, Plus } from "lucide-react";

export function BilderTab() {
  const { bilder, uppladdning, filInputRef, hanteraFilVal, hanteraRadera, öppnaFilväljare } =
    useForetagBilder();

  return (
    <div className="space-y-6">
      <input
        ref={filInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={hanteraFilVal}
        className="hidden"
      />

      {bilder.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-semibold mb-2">Inga bilder uppladdade än</h3>
          <p className="text-muted-foreground mb-4">
            Börja med att ladda upp bilder som visar ditt företag
          </p>
          <Button onClick={öppnaFilväljare} disabled={uppladdning} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            {uppladdning ? "Laddar upp..." : "Ladda upp bild(er)"}
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <Button onClick={öppnaFilväljare} disabled={uppladdning} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            {uppladdning ? "Laddar upp..." : "Ladda upp bild(er)"}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bilder.map((bild) => (
              <Card key={bild.id} className="overflow-hidden group">
                <div className="relative aspect-video">
                  <Image src={bild.bildUrl} alt="Företagsbild" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="sm" onClick={() => hanteraRadera(bild.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Radera
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
