import { useState } from "react";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";

export function useBookingDetails() {
  const [selectedBooking, setSelectedBooking] = useState<
    (Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null }) | null
  >(null);

  const openBookingDetails = (
    booking: Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null }
  ) => {
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
