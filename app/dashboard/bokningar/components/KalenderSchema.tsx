"use client";

import React from "react";
import { Card, CardContent } from "../../../_components/Card";
import { Badge } from "../../../_components/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../_components/Dialog";
import { format, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";
import type { Lunchtid } from "../../../_server/db/schema/lunchtider";
import { BookingModal } from "./BookingModal";
import { KalenderBokningModal } from "./KalenderBokningModal";
import { useKalenderNavigation } from "../hooks/useKalenderNavigation";
import { useBookingSlots } from "../hooks/useBookingSlots";
import { useBookingModal } from "../hooks/useBookingModal";
import { useBookingDetails } from "../hooks/useBookingDetails";
import { useBookingStatus } from "../hooks/useBookingStatus";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

interface KalenderSchemaProps {
  bokningar: Array<
    Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null }
  >;
  lunchtider: Lunchtid[];
  foretagsslug: string;
  tjanst?: Tjanst;
  tjanster?: Tjanst[];
  utforare?: Utforare[];
  onBookingCreated?: () => void;
}

export function KalenderSchema({
  bokningar,
  lunchtider,
  foretagsslug,
  tjanst,
  tjanster = [],
  utforare = [],
  onBookingCreated,
}: KalenderSchemaProps) {
  const [dashboardModalOpen, setDashboardModalOpen] = React.useState(false);
  const [selectedDashboardSlot, setSelectedDashboardSlot] = React.useState<{
    date: Date;
    time: string;
  } | null>(null);

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

  const {
    draggedItem,
    dropTarget,
    moveConfirmOpen,
    isMoving,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleConfirmMove,
    handleCancelMove,
  } = useDragAndDrop(foretagsslug, onBookingCreated);

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
              <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                <span>📅</span>
                <span>
                  Vecka {format(weekStart, "w", { locale: sv })} •{" "}
                  {format(weekStart, "yyyy", { locale: sv })}
                </span>
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

            {/* Kalender - Scrollable container */}
            <div className="overflow-auto max-h-[600px] relative">
              <div className="grid grid-cols-7 gap-px bg-stone-200 border border-stone-200">
                {/* Header - Veckodagar */}
                {weekDays.map((day, idx) => {
                  const isToday = isSameDay(day, new Date());
                  const isWeekend = idx >= 5;

                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-3 text-center sticky top-0 z-10 ${
                        isToday ? "bg-stone-700" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={`text-xs font-semibold uppercase ${
                            isToday ? "text-white" : "text-stone-500"
                          }`}
                        >
                          {format(day, "EEE", { locale: sv })}
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            isToday ? "text-white" : isWeekend ? "text-stone-400" : "text-stone-800"
                          }`}
                        >
                          {format(day, "d", { locale: sv })}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Tidsslots - Varje rad är en tid */}
                {timeSlots.map((timeSlot) => (
                  <React.Fragment key={timeSlot}>
                    {/* Dagkolumner - kort för varje timslot */}
                    {weekDays.map((day) => {
                      const booking = getBookingForSlot(day, timeSlot);
                      const datumStr = format(day, "yyyy-MM-dd");

                      // Check if there's a lunch time for this specific date and time
                      // Note: DB returns time as "HH:MM:SS", we need to match with "HH:MM"
                      const lunchForSlot = lunchtider.find(
                        (lunch) =>
                          lunch.datum === datumStr && lunch.startTid.substring(0, 5) === timeSlot
                      );

                      // Default lunch: weekdays at 12:00, unless there's a custom lunch time for this day
                      const hasCustomLunchThisDay = lunchtider.some(
                        (lunch) => lunch.datum === datumStr
                      );
                      const isWeekday = day.getDay() >= 1 && day.getDay() <= 5;
                      const isDefaultLunchTime = timeSlot === "12:00";
                      const shouldShowDefaultLunch =
                        isWeekday && isDefaultLunchTime && !hasCustomLunchThisDay;

                      // Show lunch if: custom lunch for this slot OR default lunch time
                      const shouldShowLunch = lunchForSlot || shouldShowDefaultLunch;

                      if (shouldShowLunch && !booking) {
                        const isDashboardMode = !tjanst && tjanster.length > 0;
                        return (
                          <div key={`${day.toISOString()}-${timeSlot}`} className="p-1 bg-white">
                            <div
                              draggable={isDashboardMode}
                              onDragStart={(e) =>
                                isDashboardMode && handleDragStart(e, "lunch", day, timeSlot)
                              }
                              className={`w-full h-full p-2 rounded-lg border-2 border-stone-300 bg-stone-100 ${
                                isDashboardMode ? "cursor-move" : ""
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-sm font-bold text-stone-600">{timeSlot}</div>
                                <div className="text-xs text-stone-500 mt-1">Lunch</div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (booking) {
                        // Bokat slot
                        const isDashboardMode = !tjanst && tjanster.length > 0;
                        return (
                          <div
                            key={`${day.toISOString()}-${timeSlot}`}
                            className="p-1 bg-white"
                            onDragOver={isDashboardMode ? handleDragOver : undefined}
                            onDrop={
                              isDashboardMode ? (e) => handleDrop(e, day, timeSlot) : undefined
                            }
                          >
                            <button
                              draggable={isDashboardMode}
                              onDragStart={(e) =>
                                isDashboardMode &&
                                handleDragStart(e, "booking", day, timeSlot, booking)
                              }
                              onClick={() => !tjanst && openBookingDetails(booking)}
                              disabled={!!tjanst}
                              className={`w-full h-full p-1.5 rounded-lg border-2 border-stone-200 bg-stone-50 text-stone-400 text-xs font-medium ${
                                tjanst
                                  ? "cursor-not-allowed"
                                  : isDashboardMode
                                  ? "cursor-move hover:bg-stone-100"
                                  : "cursor-pointer hover:bg-stone-100"
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
                      const isDashboardMode = !tjanst && tjanster.length > 0;
                      const isClickable = tjanst || isDashboardMode;

                      return (
                        <div
                          key={`${day.toISOString()}-${timeSlot}`}
                          className="p-1 bg-white"
                          onDragOver={isDashboardMode ? handleDragOver : undefined}
                          onDrop={isDashboardMode ? (e) => handleDrop(e, day, timeSlot) : undefined}
                        >
                          <button
                            onClick={() => {
                              if (tjanst) {
                                handleSlotClick(day, timeSlot);
                              } else if (isDashboardMode) {
                                setSelectedDashboardSlot({ date: day, time: timeSlot });
                                setDashboardModalOpen(true);
                              }
                            }}
                            disabled={!isClickable}
                            className={`w-full h-full p-2 rounded-lg border transition-all ${
                              isClickable
                                ? "border-amber-200 bg-white hover:bg-amber-50 hover:border-amber-400 hover:shadow-md cursor-pointer active:scale-95"
                                : "border-stone-200 bg-stone-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="text-center">
                              <div
                                className={`text-sm font-bold ${
                                  isClickable ? "text-stone-800" : "text-stone-400"
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

      {/* Dashboard Booking Modal */}
      {selectedDashboardSlot && (
        <KalenderBokningModal
          isOpen={dashboardModalOpen}
          onClose={() => {
            setDashboardModalOpen(false);
            setSelectedDashboardSlot(null);
          }}
          selectedDate={selectedDashboardSlot.date}
          selectedTime={selectedDashboardSlot.time}
          tjanster={tjanster}
          utforare={utforare}
          onSuccess={() => {
            if (onBookingCreated) onBookingCreated();
          }}
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
                <div className="text-sm font-semibold text-muted-foreground mb-1">Utförare</div>
                <div>{selectedBooking.utforare?.namn || "Ingen utförare vald"}</div>
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

      {/* Move Confirmation Dialog */}
      <Dialog open={moveConfirmOpen} onOpenChange={(open) => !open && handleCancelMove()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bekräfta ändring</DialogTitle>
          </DialogHeader>

          {draggedItem && dropTarget && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Du håller på att uppdatera följande:</p>

              <div className="bg-stone-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="font-semibold">Typ: </span>
                  {draggedItem.type === "lunch" ? "Lunch" : "Bokning"}
                </div>
                {draggedItem.booking && (
                  <div>
                    <span className="font-semibold">Kund: </span>
                    {draggedItem.booking.kund?.namn}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Från: </span>
                  {format(draggedItem.sourceDate, "EEEE d", { locale: sv })}, kl.{" "}
                  {draggedItem.sourceTime}
                </div>
                <div>
                  <span className="font-semibold">Ny tid: </span>
                  {format(dropTarget.date, "EEEE d", { locale: sv })}, kl. {dropTarget.time}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelMove}
                  disabled={isMoving}
                  className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleConfirmMove}
                  disabled={isMoving}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMoving ? "Flyttar..." : "Bekräfta"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
