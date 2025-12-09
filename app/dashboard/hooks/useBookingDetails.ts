import { useState } from "react";
import type { Bokning } from "../../_server/db/schema/bokningar";
import type { Anvandare } from "../../_server/db/schema/anvandare";
import type { Tjanst } from "../../_server/db/schema/tjanster";

export function useBookingDetails() {
  const [selectedBooking, setSelectedBooking] = useState<
    (Bokning & { kund: Anvandare | null; tjanst: Tjanst | null }) | null
  >(null);

  const openBookingDetails = (
    booking: Bokning & { kund: Anvandare | null; tjanst: Tjanst | null }
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
