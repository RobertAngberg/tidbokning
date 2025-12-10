import { useMemo } from "react";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";

type BokningMedRelationer = Bokning & {
  kund: Kund | null;
  tjanst: Tjanst | null;
  utforare: Utforare | null;
};

type Oppettider =
  | {
      [key: string]: {
        open: string;
        close: string;
        stangt: boolean;
      };
    }
  | null
  | undefined;

export function useBookingSlots(
  bokningar: BokningMedRelationer[],
  oppettider?: Oppettider,
  weekDays?: Date[]
) {
  // Generera tidslots baserat på öppettider eller fallback till 08:00-17:00
  const timeSlots = useMemo(() => {
    // Om inga öppettider finns, använd default 08:00-17:00
    if (!oppettider || !weekDays || weekDays.length === 0) {
      return Array.from({ length: 18 }, (_, i) => {
        const hour = Math.floor(i / 2) + 8;
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour.toString().padStart(2, "0")}:${minute}`;
      });
    }

    // Hitta min och max tid från alla öppettider
    const veckodagar = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];
    let minHour = 8;
    let maxHour = 17;

    weekDays.forEach((day) => {
      const veckodag = veckodagar[day.getDay()];
      const dagensOppettider = oppettider[veckodag];

      if (dagensOppettider && !dagensOppettider.stangt) {
        const openHour = parseInt(dagensOppettider.open.split(":")[0]);
        const closeHour = parseInt(dagensOppettider.close.split(":")[0]);
        const closeMinute = parseInt(dagensOppettider.close.split(":")[1]);

        minHour = Math.min(minHour, openHour);
        maxHour = Math.max(maxHour, closeMinute > 0 ? closeHour + 1 : closeHour);
      }
    });

    // Generera slots från minHour till maxHour
    const slots = [];
    for (let hour = minHour; hour < maxHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }

    return slots;
  }, [oppettider, weekDays]);

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
  const isFirstSlotForBooking = (booking: Bokning | undefined, day: Date, timeSlot: string) => {
    if (!booking) return false;
    const [hour, minute] = timeSlot.split(":").map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hour, minute, 0, 0);
    const bokningStart = new Date(booking.startTid);
    return slotTime.getTime() === bokningStart.getTime();
  };

  // Beräkna hur många slots en bokning tar
  const getBookingSlotSpan = (booking: Bokning) => {
    const start = new Date(booking.startTid);
    const end = new Date(booking.slutTid);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.ceil(durationMinutes / 30); // 30 min per slot
  };

  // Mappar statustext från databasen till Badge-komponentens färgvarianter
  const statusVariant = (status: string) => {
    switch (status) {
      case "Bekräftad":
        return "success" as const;
      case "Väntande":
        return "secondary" as const;
      case "Inställd":
        return "destructive" as const;
      case "Slutförd":
        return "outline" as const;
      default:
        return "default" as const;
    }
  };

  return {
    timeSlots,
    getBookingForSlot,
    isFirstSlotForBooking,
    getBookingSlotSpan,
    statusVariant,
  };
}
