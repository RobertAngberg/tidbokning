import { useActionState, useEffect } from "react";
import { skapaBokning } from "../actions/bokningar";

export interface BookingFormData {
  namn: string;
  email: string;
  telefon: string;
  utforareId: string;
  anteckningar?: string;
}

interface UseKundBokningProps {
  selectedDate: Date;
  selectedTime: string;
  tjänstId: string;
  onSuccess?: () => void;
  onClose: () => void;
}

export function useKundBokning({
  selectedDate,
  selectedTime,
  tjänstId,
  onSuccess,
  onClose,
}: UseKundBokningProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: Awaited<ReturnType<typeof skapaBokning>> | null, formData: FormData) => {
      // Parse start time from date and time
      const [hour, minute] = selectedTime.split(":").map(Number);
      const startTid = new Date(selectedDate);
      startTid.setHours(hour, minute, 0, 0);

      return await skapaBokning({
        kundNamn: formData.get("namn") as string,
        kundEmail: formData.get("email") as string,
        kundTelefon: formData.get("telefon") as string,
        tjänstId,
        utforareId: formData.get("utforareId") as string,
        startTid,
        anteckningar: formData.get("anteckningar") as string,
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
