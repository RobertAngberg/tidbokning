import { useState, useEffect, useRef } from "react";
import { laddaUppFil } from "../../foretagsuppgifter/actions/upload";
import { hämtaBilder, laddaUppBild, raderaBild } from "../actions/bilder";
import type { ForetagBild } from "../../../_server/db/schema/foretagBilder";

export function useForetagBilder() {
  const [bilder, setBilder] = useState<ForetagBild[]>([]);
  const [loading, setLoading] = useState(true);
  const [uppladdning, setUppladdning] = useState(false);
  const filInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function initiera() {
      setLoading(true);
      const resultat = await hämtaBilder();
      if (resultat.success && resultat.data) {
        setBilder(resultat.data);
      }
      setLoading(false);
    }
    initiera();
  }, []);

  const hämtaBilderFn = async () => {
    setLoading(true);
    const resultat = await hämtaBilder();
    if (resultat.success && resultat.data) {
      setBilder(resultat.data);
    }
    setLoading(false);
  };

  async function hanteraFilVal(event: React.ChangeEvent<HTMLInputElement>) {
    const filer = event.target.files;
    if (!filer || filer.length === 0) return;

    setUppladdning(true);

    try {
      // Ladda upp alla filer parallellt
      const uppladdningar = Array.from(filer).map(async (fil, index) => {
        const formData = new FormData();
        formData.append("file", fil);
        const resultat = await laddaUppFil(formData);

        if (resultat.success && resultat.url) {
          const bildResultat = await laddaUppBild({
            bildUrl: resultat.url,
            sorteringsordning: bilder.length + index,
          });
          return bildResultat;
        }
      });

      await Promise.all(uppladdningar);

      setUppladdning(false);
      await hämtaBilderFn();

      // Återställ input
      if (filInputRef.current) {
        filInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Fel vid uppladdning:", error);
      setUppladdning(false);
    }
  }

  async function hanteraRadera(id: string) {
    if (!confirm("Är du säker på att du vill radera denna bild?")) return;

    const resultat = await raderaBild(id);
    if (resultat.success) {
      await hämtaBilderFn();
    }
  }

  function öppnaFilväljare() {
    filInputRef.current?.click();
  }

  return {
    bilder,
    loading,
    uppladdning,
    filInputRef,
    hanteraFilVal,
    hanteraRadera,
    öppnaFilväljare,
  };
}
