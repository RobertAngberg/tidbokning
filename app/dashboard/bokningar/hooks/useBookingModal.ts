import { useState } from "react";
import type { Tjanst } from "../../../_server/db/schema/tjanster";

export function useBookingModal(tjanst?: Tjanst, onBookingCreated?: () => void) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);

  const handleSlotClick = (day: Date, timeSlot: string) => {
    // Bara tillåt bokning om vi har tjänst
    if (!tjanst) return;

    setSelectedSlot({ date: day, time: timeSlot });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedSlot,
    handleSlotClick,
    closeModal,
  };
}
