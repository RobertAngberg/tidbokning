import { useActionState, useEffect } from "react";
import { skapaBokning } from "../actions/bokningar";

interface UseKalenderBokningProps {
  selectedDate: Date;
  selectedTime: string;
  onSuccess?: () => void;
  onClose: () => void;
}

export function useKalenderBokning({
  selectedDate,
  selectedTime,
  onSuccess,
  onClose,
}: UseKalenderBokningProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      // Kombinera datum och tid till Date object
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const startTid = new Date(selectedDate);
      startTid.setHours(hours, minutes, 0, 0);

      const result = await skapaBokning({
        kundNamn: formData.get("kundNamn") as string,
        kundEmail: formData.get("kundEmail") as string,
        kundTelefon: formData.get("kundTelefon") as string,
        tjänstId: formData.get("tjänstId") as string,
        utforareId:
          formData.get("utforareId") && formData.get("utforareId") !== "none"
            ? (formData.get("utforareId") as string)
            : undefined,
        startTid,
        anteckningar: formData.get("anteckningar") as string | undefined,
      });

      return result;
    },
    null
  );

  // Stäng modal och refresh vid success
  useEffect(() => {
    if (state?.success) {
      onClose();
      if (onSuccess) onSuccess();
    }
  }, [state, onClose, onSuccess]);

  return {
    isPending,
    error: state?.success === false ? state.error : null,
    formAction,
  };
}
