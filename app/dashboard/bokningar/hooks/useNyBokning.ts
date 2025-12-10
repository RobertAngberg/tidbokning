import { useActionState, useEffect } from "react";
import { skapaBokning } from "../actions/bokningar";

interface UseNyBokningProps {
  onSuccess?: () => void;
  onClose: () => void;
}

export function useNyBokning({ onSuccess, onClose }: UseNyBokningProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: Awaited<ReturnType<typeof skapaBokning>> | null, formData: FormData) => {
      // Kombinera datum och tid till Date object
      const datum = formData.get("datum") as string;
      const tid = formData.get("tid") as string;
      const [year, month, day] = datum.split("-").map(Number);
      const [hours, minutes] = tid.split(":").map(Number);
      const startTid = new Date(year, month - 1, day, hours, minutes);

      return await skapaBokning({
        kundNamn: formData.get("kundNamn") as string,
        kundEmail: formData.get("kundEmail") as string,
        kundTelefon: formData.get("kundTelefon") as string,
        tjänstId: formData.get("tjänstId") as string,
        utforareId: (formData.get("utforareId") as string) || undefined,
        startTid,
        anteckningar: (formData.get("anteckningar") as string) || undefined,
      });
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [state?.success, onClose, onSuccess]);

  return {
    isPending,
    error: state?.success === false ? state.error : undefined,
    formAction,
  };
}
