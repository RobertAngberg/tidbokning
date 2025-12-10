import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";

type BokningMedRelationer = Bokning & {
  kund: Kund | null;
  tjanst: Tjanst | null;
};

export function useBookingSlots(bokningar: BokningMedRelationer[]) {
  // Tidslots från 08:00 till 17:00 (30 min intervall)
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  // Hitta bokningar för specifik dag och tid
  const getBookingForSlot = (day: Date, timeSlot: string) => {
    const [hour, minute] = timeSlot.split(":").map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hour, minute, 0, 0);

    return bokningar.find((b) => {
      const bokningStart = new Date(b.startTid);
      const bokningEnd = new Date(b.slutTid);
      return slotTime >= bokningStart && slotTime < bokningEnd;
    });
  };

  // Kolla om detta är första sloten för en bokning (där vi ska rendera den)
  const isFirstSlotForBooking = (
    booking: BokningMedRelationer | undefined,
    day: Date,
    timeSlot: string
  ) => {
    if (!booking) return false;
    const [hour, minute] = timeSlot.split(":").map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hour, minute, 0, 0);
    const bokningStart = new Date(booking.startTid);
    return slotTime.getTime() === bokningStart.getTime();
  };

  // Beräkna hur många slots en bokning tar
  const getBookingSlotSpan = (booking: BokningMedRelationer) => {
    const start = new Date(booking.startTid);
    const end = new Date(booking.slutTid);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.ceil(durationMinutes / 30); // 30 min per slot
  };

  return {
    timeSlots,
    getBookingForSlot,
    isFirstSlotForBooking,
    getBookingSlotSpan,
  };
}
