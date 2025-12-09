import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { BookingFormData } from "../components/BookingModal";
import { skapaBokning } from "../actions/bokningar";

export function useBookingModal(tjanst?: Tjanst, onBookingCreated?: () => void) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const router = useRouter();

  const handleSlotClick = (day: Date, timeSlot: string) => {
    if (!tjanst) return;
    setSelectedSlot({ date: day, time: timeSlot });
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (formData: BookingFormData) => {
    if (!selectedSlot || !tjanst) return;

    // Skapa startTid från valt datum och tid
    const [hour, minute] = selectedSlot.time.split(":").map(Number);
    const startTid = new Date(selectedSlot.date);
    startTid.setHours(hour, minute, 0, 0);

    try {
      await skapaBokning({
        tjänstId: tjanst.id,
        utforareId: formData.utforareId,
        startTid,
        kundNamn: formData.namn,
        kundEmail: formData.email,
        kundTelefon: formData.telefon,
        anteckningar: formData.anteckningar,
      });

      setIsModalOpen(false);
      setSelectedSlot(null);

      if (onBookingCreated) {
        onBookingCreated();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Fel vid bokning:", error);
      throw error;
    }
  };

  return {
    isModalOpen,
    selectedSlot,
    handleSlotClick,
    handleBookingSubmit,
    closeModal: () => setIsModalOpen(false),
  };
}
