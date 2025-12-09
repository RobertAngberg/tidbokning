"use client";

import { useState, useRef } from "react";
import { laddaUppFil, raderaFil } from "../../foretagsuppgifter/actions/upload";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "../../../_components/Button";
import Image from "next/image";

interface BildUppladdareProps {
  nuvarandeBildUrl?: string;
  onUppladdningsKlar: (url: string) => void;
  label?: string;
  beskrivning?: string;
}

export function BildUppladdare({
  nuvarandeBildUrl,
  onUppladdningsKlar,
  label = "Bild",
  beskrivning = "PNG, JPG eller GIF (max 5MB)",
}: BildUppladdareProps) {
  const [uppladdning, setUppladdning] = useState(false);
  const [förhandsgranskning, setFörhandsgranskning] = useState<string | null>(
    nuvarandeBildUrl || null
  );
  const [felmeddelande, setFelmeddelande] = useState<string | null>(null);
  const filInputRef = useRef<HTMLInputElement>(null);

  const hanteraFilVal = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fil = event.target.files?.[0];
    if (!fil) return;

    setFelmeddelande(null);

    // Visa förhandsgranskning direkt
    const reader = new FileReader();
    reader.onloadend = () => {
      setFörhandsgranskning(reader.result as string);
    };
    reader.readAsDataURL(fil);

    // Ladda upp filen
    setUppladdning(true);
    const formData = new FormData();
    formData.append("file", fil);

    const resultat = await laddaUppFil(formData);

    if (resultat.success && resultat.url) {
      onUppladdningsKlar(resultat.url);
    } else {
      setFelmeddelande(resultat.error || "Kunde inte ladda upp bilden");
      setFörhandsgranskning(nuvarandeBildUrl || null);
    }

    setUppladdning(false);
  };

  const hanteraBorttagning = async () => {
    if (!förhandsgranskning) return;

    // Om det är en blob URL, radera från Vercel Blob
    if (
      förhandsgranskning.includes("vercel-storage.com") ||
      förhandsgranskning.includes("blob.vercel-storage.com")
    ) {
      await raderaFil(förhandsgranskning);
    }

    setFörhandsgranskning(null);
    onUppladdningsKlar("");
    if (filInputRef.current) {
      filInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-stone-700">{label}</label>

      <div className="space-y-3">
        {/* Förhandsgranskning */}
        {förhandsgranskning ? (
          <div className="relative w-full max-w-md h-32 rounded-lg overflow-hidden border-2 border-stone-200">
            <Image
              src={förhandsgranskning}
              alt="Förhandsgranskning"
              fill
              className="object-contain bg-stone-50"
            />
            {!uppladdning && (
              <button
                onClick={hanteraBorttagning}
                type="button"
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {uppladdning && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-md h-32 rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center bg-stone-50">
            <Upload className="w-8 h-8 text-stone-400" />
          </div>
        )}

        {/* Uppladdningsknapp */}
        <div className="space-y-2">
          <input
            ref={filInputRef}
            type="file"
            accept="image/*"
            onChange={hanteraFilVal}
            disabled={uppladdning}
            className="hidden"
            id={`file-upload-${label}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => filInputRef.current?.click()}
            disabled={uppladdning}
            className="w-auto"
          >
            {uppladdning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Laddar upp...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Välj bild
              </>
            )}
          </Button>
          <p className="text-xs text-stone-500">{beskrivning}</p>
          {felmeddelande && <p className="text-xs text-red-600">{felmeddelande}</p>}
        </div>
      </div>
    </div>
  );
}
