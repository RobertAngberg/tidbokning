"use client";

import { useState } from "react";
import { Card, CardContent } from "../../_components/Card";
import { Badge } from "../../_components/Badge";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import type { Bokning } from "../../_server/db/schema/bokningar";
import type { Anvandare } from "../../_server/db/schema/anvandare";
import type { Tjanst } from "../../_server/db/schema/tjanster";
import type { Utforare } from "../../_server/db/schema/utforare";
import { BookingModal, type BookingFormData } from "./BookingModal";
import { skapaBokning } from "../../dashboard/actions/bokningar";
import { useRouter } from "next/navigation";

interface KalenderSchemaProps {
  bokningar: Array<Bokning & { kund: Anvandare | null; tjanst: Tjanst | null }>;
  tjanst?: Tjanst;
  utforare?: Utforare[];
  onBookingCreated?: () => void;
}

export function KalenderSchema({
  bokningar,
  tjanst,
  utforare = [],
  onBookingCreated,
}: KalenderSchemaProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const router = useRouter();

  // Räkna ut veckostart (måndag)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

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

  // Navigation
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

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

  const handleSlotClick = (day: Date, timeSlot: string) => {
    // Bara tillåt bokning om vi har tjänst och inga befintliga bokningar i sloten
    if (!tjanst) return;

    const booking = getBookingForSlot(day, timeSlot);
    if (booking) return; // Redan bokad

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
      const result = await skapaBokning({
        kundNamn: formData.namn,
        kundEmail: formData.email,
        kundTelefon: formData.telefon,
        tjänstId: tjanst.id,
        utforareId: formData.utforareId,
        startTid,
        anteckningar: formData.anteckningar,
      });

      if (result.success) {
        // Stäng modal och refresha sidan
        setIsModalOpen(false);
        router.refresh();
        if (onBookingCreated) {
          onBookingCreated();
        }
      } else {
        alert(`Fel vid bokning: ${result.error}`);
      }
    } catch (error) {
      console.error("Fel vid bokning:", error);
      alert("Något gick fel vid bokningen");
    }
  };

  return (
    <>
      <Card className="overflow-hidden border-stone-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Veckonavigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousWeek}
                className="p-2.5 hover:bg-amber-100 text-stone-700 rounded-lg transition-all hover:scale-110 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-stone-800">
                Vecka {format(weekStart, "w", { locale: sv })} •{" "}
                {format(weekStart, "yyyy", { locale: sv })}
              </h2>
              <button
                onClick={goToNextWeek}
                className="p-2.5 hover:bg-amber-100 text-stone-700 rounded-lg transition-all hover:scale-110 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Veckovy */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-8 bg-stone-50">
                {/* Tidkolumn header */}
                <div className="p-3 border-b border-r border-stone-200 bg-stone-100">
                  <span className="text-xs font-bold text-stone-600 uppercase">Tid</span>
                </div>

                {/* Dagheaders */}
                {weekDays.map((day, idx) => {
                  const isToday = isSameDay(day, new Date());
                  const isWeekend = idx >= 5;

                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-3 border-b border-stone-200 text-center ${
                        idx < 6 ? "border-r" : ""
                      } ${isToday ? "bg-amber-50" : ""}`}
                    >
                      <div className="text-xs font-semibold text-stone-500 uppercase">
                        {format(day, "EEE", { locale: sv })}
                      </div>
                      <div
                        className={`text-lg font-bold mt-1 ${
                          isToday
                            ? "text-amber-700"
                            : isWeekend
                            ? "text-stone-400"
                            : "text-stone-800"
                        }`}
                      >
                        {format(day, "d", { locale: sv })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tidsslots */}
              {timeSlots.map((timeSlot, slotIdx) => (
                <div key={timeSlot} className="grid grid-cols-8">
                  {/* Tidkolumn */}
                  <div
                    className={`p-2 border-r border-stone-200 bg-stone-50 text-xs font-semibold text-stone-600 text-right ${
                      slotIdx < timeSlots.length - 1 ? "border-b" : ""
                    }`}
                  >
                    {timeSlot}
                  </div>

                  {/* Dagkolumner */}
                  {weekDays.map((day, dayIdx) => {
                    const booking = getBookingForSlot(day, timeSlot);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <div
                        key={`${day.toISOString()}-${timeSlot}`}
                        onClick={() => !booking && tjanst && handleSlotClick(day, timeSlot)}
                        className={`p-2 min-h-[60px] ${dayIdx < 6 ? "border-r" : ""} ${
                          slotIdx < timeSlots.length - 1 ? "border-b" : ""
                        } border-stone-200 ${isToday ? "bg-amber-50/30" : "bg-white"} ${
                          !booking && tjanst
                            ? "hover:bg-amber-50 cursor-pointer"
                            : "hover:bg-stone-50"
                        } transition-colors`}
                      >
                        {booking ? (
                          <div className="bg-amber-100 border border-amber-300 rounded p-2 text-xs h-full">
                            <div className="font-bold text-stone-800 truncate mb-1">
                              {booking.kund?.namn}
                            </div>
                            <div className="text-stone-600 truncate text-[10px]">
                              {booking.tjanst?.namn}
                            </div>
                            <Badge
                              variant={statusVariant(booking.status)}
                              className="text-[9px] mt-1 px-1 py-0"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        ) : tjanst ? (
                          <div className="text-center text-stone-300 text-xs opacity-0 group-hover:opacity-100">
                            +
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Modal */}
      {selectedSlot && tjanst && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedSlot.date}
          selectedTime={selectedSlot.time}
          tjanst={tjanst}
          utforare={utforare}
          onSubmit={handleBookingSubmit}
        />
      )}
    </>
  );
}
