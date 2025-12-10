import { useState, useEffect } from "react";
import { hämtaÖppettider, sparaÖppettid } from "../actions/oppettider";
import type { Oppettid } from "../../../_server/db/schema/oppettider";

type OppettidChange = {
  veckodag: string;
  oppnar: string;
  stanger: string;
  stangt: boolean;
};

export function useOppettider() {
  const [oppettider, setOppettider] = useState<Oppettid[]>([]);
  const [loading, setLoading] = useState(true);
  const [sparar, setSparar] = useState(false);
  const [andringar, setAndringar] = useState<Map<string, OppettidChange>>(new Map());

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      if (mounted) {
        setLoading(true);
        const data = await hämtaÖppettider();
        if (mounted) {
          setOppettider(data);
          setLoading(false);
        }
      }
    };
    void loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const hämtaÖppettidForDag = (dag: string) => {
    // Returnera ändring om den finns, annars befintlig data
    const andring = andringar.get(dag);
    if (andring) {
      return {
        veckodag: dag,
        oppnar: andring.oppnar,
        stanger: andring.stanger,
        stangt: andring.stangt,
      } as Oppettid;
    }
    return oppettider.find((o) => o.veckodag === dag);
  };

  const handleChange = (veckodag: string, oppnar: string, stanger: string, stangt: boolean) => {
    setAndringar((prev) => {
      const ny = new Map(prev);
      ny.set(veckodag, { veckodag, oppnar, stanger, stangt });
      return ny;
    });
  };

  const handleSparaAlla = async () => {
    if (andringar.size === 0) return;

    setSparar(true);

    // Spara alla ändringar
    for (const [_, andring] of andringar) {
      await sparaÖppettid({
        veckodag: andring.veckodag,
        oppnar: andring.stangt ? null : andring.oppnar || null,
        stanger: andring.stangt ? null : andring.stanger || null,
        stangt: andring.stangt,
      });
    }

    // Hämta uppdaterad data
    setLoading(true);
    const data = await hämtaÖppettider();
    setOppettider(data);
    setLoading(false);
    setAndringar(new Map());
    setSparar(false);
  };

  return {
    oppettider,
    loading,
    sparar,
    harAndrats: andringar.size > 0,
    hämtaÖppettidForDag,
    handleChange,
    handleSparaAlla,
  };
}
