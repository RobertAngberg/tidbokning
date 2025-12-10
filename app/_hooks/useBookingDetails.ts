import { useState } from "react";
import type { Bokning } from "../_server/db/schema/bokningar";
import type { Anvandare } from "../_server/db/schema/anvandare";
import type { Tjanst } from "../_server/db/schema/tjanster";

type BokningMedRelationer = Bokning & { kund: Anvandare | null; tjanst: Tjanst | null };

export function useBookingDetails() {
  const [selectedBooking, setSelectedBooking] = useState<BokningMedRelationer | null>(null);

  const openBookingDetails = (booking: BokningMedRelationer) => {
    setSelectedBooking(booking);
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
  };

  return {
    selectedBooking,
    openBookingDetails,
    closeBookingDetails,
  };
}
