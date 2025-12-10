import { useState, useEffect, useActionState } from "react";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";
import { raderaBokning, uppdateraBokningFullstandig } from "../actions/bokningar";

type BokningMedRelationer = Bokning & {
  kund: Kund | null;
  tjanst: Tjanst | null;
  utforare: Utforare | null;
};

interface UseRedigeraBokningProps {
  bokning: BokningMedRelationer;
  onSuccess: () => void;
  onClose: () => void;
}

const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function useRedigeraBokning({ bokning, onSuccess, onClose }: UseRedigeraBokningProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (
      _prevState: Awaited<ReturnType<typeof uppdateraBokningFullstandig>> | null,
      formData: FormData
    ) => {
      return await uppdateraBokningFullstandig(bokning.id, {
        kundNamn: formData.get("kundNamn") as string,
        kundEmail: formData.get("kundEmail") as string,
        kundTelefon: formData.get("kundTelefon") as string,
        tjanstId: formData.get("tjanstId") as string,
        utforareId: formData.get("utforareId") as string,
        startTid: formData.get("startTid") as string,
        status: formData.get("status") as "Bekräftad" | "Inställd" | "Slutförd",
        anteckningar: formData.get("anteckningar") as string,
      });
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      onClose();
      onSuccess();
    }
  }, [state?.success, onClose, onSuccess]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await raderaBokning(bokning.id);
      if (result.success) {
        onClose();
        onSuccess();
      } else {
        console.error("Fel vid radering:", result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error("Fel vid radering:", error);
      alert("Kunde inte radera bokningen");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isPending,
    isDeleting,
    error: state?.success === false ? state.error : undefined,
    formAction,
    handleDelete,
    defaultValues: {
      kundNamn: bokning.kund?.namn || "",
      kundEmail: bokning.kund?.email || "",
      kundTelefon: bokning.kund?.telefon || "",
      tjanstId: bokning.tjanstId,
      utforareId: bokning.utforareId || "",
      startTid: formatDateForInput(new Date(bokning.startTid)),
      status: bokning.status,
      anteckningar: bokning.anteckningar || "",
    },
  };
}
