import { useState, useEffect } from "react";
import { hämtaÖppettider, sparaÖppettid } from "../actions/oppettider";
import type { Oppettid } from "../../_server/db/schema/oppettider";

export function useOppettider() {
  const [oppettider, setOppettider] = useState<Oppettid[]>([]);
  const [loading, setLoading] = useState(true);
  const [sparar, setSparar] = useState(false);

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
    return oppettider.find((o) => o.veckodag === dag);
  };

  const handleSparaÖppettid = async (
    veckodag: string,
    oppnar: string,
    stanger: string,
    stangt: boolean
  ) => {
    setSparar(true);
    const resultat = await sparaÖppettid({
      veckodag,
      oppnar: stangt ? null : oppnar || null,
      stanger: stangt ? null : stanger || null,
      stangt,
    });

    if (resultat.success) {
      setLoading(true);
      const data = await hämtaÖppettider();
      setOppettider(data);
      setLoading(false);
    }
    setSparar(false);
  };

  return {
    oppettider,
    loading,
    sparar,
    hämtaÖppettidForDag,
    handleSparaÖppettid,
  };
}
