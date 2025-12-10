"use client";

import React from "react";
import { Card, CardContent } from "../../../_components/Card";
import { Badge } from "../../../_components/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../_components/Dialog";
import { format, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Anvandare } from "../../../_server/db/schema/anvandare";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";
import { BookingModal } from "./BookingModal";
import { useKalenderNavigation } from "../hooks/useKalenderNavigation";
import { useBookingSlots } from "../hooks/useBookingSlots";
import { useBookingModal } from "../hooks/useBookingModal";
import { useBookingDetails } from "../hooks/useBookingDetails";
import { useBookingStatus } from "../hooks/useBookingStatus";

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
  const { weekStart, weekDays, goToPreviousWeek, goToNextWeek } = useKalenderNavigation();

  const { timeSlots, getBookingForSlot } = useBookingSlots(bokningar);

  const { isModalOpen, selectedSlot, handleSlotClick, handleBookingSubmit, closeModal } =
    useBookingModal(tjanst, () => {
      if (onBookingCreated) {
        onBookingCreated();
      }
    });

  const { selectedBooking, openBookingDetails, closeBookingDetails } = useBookingDetails();

  const { statusVariant } = useBookingStatus();

  return (
    <>
      <Card className="overflow-hidden border-stone-200">
        <CardContent className="pt-6">
          <div className="space-y-6">
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

            {/* Kalender */}
            <div className="grid grid-cols-7 gap-px bg-stone-200 border border-stone-200">
              {/* Header - Veckodagar */}
              {weekDays.map((day, idx) => {
                const isToday = isSameDay(day, new Date());
                const isWeekend = idx >= 5;

                return (
                  <div key={day.toISOString()} className="p-3 text-center bg-white">
                    <div className="text-xs font-semibold text-stone-500 uppercase mb-1">
                      {format(day, "EEE", { locale: sv })}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        isToday ? "text-amber-700" : isWeekend ? "text-stone-400" : "text-stone-800"
                      }`}
                    >
                      {format(day, "d", { locale: sv })}
                    </div>
                    {isToday && (
                      <Badge className="bg-amber-500 text-white text-[10px] mt-1">Idag</Badge>
                    )}
                  </div>
                );
              })}

              {/* Tidsslots - Varje rad är en tid */}
              {timeSlots.map((timeSlot) => (
                <React.Fragment key={timeSlot}>
                  {/* Dagkolumner - kort för varje timslot */}
                  {weekDays.map((day) => {
                    const booking = getBookingForSlot(day, timeSlot);

                    if (booking) {
                      // Bokat slot
                      return (
                        <div key={`${day.toISOString()}-${timeSlot}`} className="p-1 bg-white">
                          <button
                            onClick={() => !tjanst && openBookingDetails(booking)}
                            disabled={!!tjanst}
                            className={`w-full h-full p-1.5 rounded-lg border-2 border-stone-200 bg-stone-50 text-stone-400 text-xs font-medium ${
                              tjanst ? "cursor-not-allowed" : "cursor-pointer hover:bg-stone-100"
                            }`}
                          >
                            <div className="text-center line-through">{timeSlot}</div>
                            {!tjanst && booking.kund && (
                              <div className="text-[10px] mt-1 truncate">{booking.kund.namn}</div>
                            )}
                          </button>
                        </div>
                      );
                    }

                    // Ledigt slot - visa som klickbart kort med tid och pris
                    return (
                      <div key={`${day.toISOString()}-${timeSlot}`} className="p-1 bg-white">
                        <button
                          onClick={() => tjanst && handleSlotClick(day, timeSlot)}
                          disabled={!tjanst}
                          className={`w-full h-full p-2 rounded-lg border transition-all ${
                            tjanst
                              ? "border-amber-200 bg-white hover:bg-amber-50 hover:border-amber-400 hover:shadow-md cursor-pointer active:scale-95"
                              : "border-stone-200 bg-stone-50 cursor-not-allowed"
                          }`}
                        >
                          <div className="text-center">
                            <div
                              className={`text-sm font-bold ${
                                tjanst ? "text-stone-800" : "text-stone-400"
                              }`}
                            >
                              {timeSlot}
                            </div>
                            {tjanst && (
                              <div className="text-amber-600 text-xs font-semibold">
                                {tjanst.pris / 100} kr
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Modal */}
      {selectedSlot && tjanst && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedDate={selectedSlot.date}
          selectedTime={selectedSlot.time}
          tjanst={tjanst}
          utforare={utforare}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && closeBookingDetails()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bokningsdetaljer</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Kund</div>
                <div className="font-bold">{selectedBooking.kund?.namn}</div>
                {selectedBooking.kund?.email && (
                  <div className="text-sm text-muted-foreground">{selectedBooking.kund.email}</div>
                )}
                {selectedBooking.kund?.telefon && (
                  <div className="text-sm text-muted-foreground">
                    {selectedBooking.kund.telefon}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Tjänst</div>
                <div>{selectedBooking.tjanst?.namn}</div>
              </div>

              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Tid</div>
                <div>
                  {format(new Date(selectedBooking.startTid), "PPP 'kl' HH:mm", { locale: sv })}
                </div>
                <div className="text-sm text-muted-foreground">
                  Varaktighet:{" "}
                  {Math.round(
                    (new Date(selectedBooking.slutTid).getTime() -
                      new Date(selectedBooking.startTid).getTime()) /
                      (1000 * 60)
                  )}{" "}
                  minuter
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Status</div>
                <Badge variant={statusVariant(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
