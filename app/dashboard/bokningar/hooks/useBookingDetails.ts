import { useState } from "react";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";

type BokningMedRelationer = Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null };

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
