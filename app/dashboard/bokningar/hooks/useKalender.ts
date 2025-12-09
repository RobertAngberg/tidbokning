"use client";

import { useMemo } from "react";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Anvandare } from "../../../_server/db/schema/anvandare";
import type { Tjanst } from "../../../_server/db/schema/tjanster";

type BokningMedRelationer = Bokning & { kund: Anvandare | null; tjanst: Tjanst | null };

export function useKalender(bokningar: BokningMedRelationer[], selectedDate?: Date) {
  // Hitta bokningar för valt datum
  const bokningarForDatum = useMemo(() => {
    if (!selectedDate) return [];

    return bokningar.filter((bokning) => {
      const bokningDate = new Date(bokning.startTid);
      return (
        bokningDate.getFullYear() === selectedDate.getFullYear() &&
        bokningDate.getMonth() === selectedDate.getMonth() &&
        bokningDate.getDate() === selectedDate.getDate()
      );
    });
  }, [bokningar, selectedDate]);

  // Sortera bokningar efter starttid
  const sorteradeBokningar = useMemo(
    () =>
      bokningarForDatum.sort(
        (a, b) => new Date(a.startTid).getTime() - new Date(b.startTid).getTime()
      ),
    [bokningarForDatum]
  );

  // Hitta dagar med bokningar för att markera i kalendern
  const daysWithBookings = useMemo(
    () => bokningar.map((bokning) => new Date(bokning.startTid)),
    [bokningar]
  );

  // Räkna ut aktuell månad
  const currentMonth = selectedDate || new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Första och sista dagen i månaden
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Vilken veckodag börjar månaden på (0 = söndag, 1 = måndag, etc)
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Konvertera till måndag = 0

  // Antal dagar i månaden
  const daysInMonth = lastDayOfMonth.getDate();

  // Skapa array med alla datum i månaden
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  const hasBooking = (date: Date) => {
    return daysWithBookings.some(
      (bookingDate) =>
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const statusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" | "success" => {
    switch (status) {
      case "bekraftad":
        return "success";
      case "vaentande":
        return "secondary";
      case "installld":
        return "destructive";
      case "slutford":
        return "outline";
      default:
        return "outline";
    }
  };

  const statusText = (status: string) => {
    switch (status) {
      case "bekraftad":
        return "Bekräftad";
      case "vaentande":
        return "Väntande";
      case "installld":
        return "Inställd";
      case "slutford":
        return "Slutförd";
      default:
        return status;
    }
  };

  return {
    sorteradeBokningar,
    daysWithBookings,
    currentMonth,
    year,
    month,
    startingDayOfWeek,
    days,
    hasBooking,
    isSelected,
    statusVariant,
    statusText,
  };
}
