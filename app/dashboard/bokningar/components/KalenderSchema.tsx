"use client";

import React from "react";
import { Card, CardContent } from "../../../_components/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../_components/Dialog";
import { format, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../_server/db/schema/utforare";
import type { Lunchtid } from "../../../_server/db/schema/lunchtider";
import type { UtforareTillganglighet } from "../../../_server/db/schema/utforare-tillganglighet";
import { KundBokningModal } from "./KundBokningModal";
import { KalenderBokningModal } from "./KalenderBokningModal";
import { useKalenderNavigation } from "../hooks/useKalenderNavigation";
import { useBookingSlots } from "../hooks/useBookingSlots";
import { useBookingModal } from "../hooks/useBookingModal";
import { useBookingDetails } from "../hooks/useBookingDetails";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { RedigeraBokningModal } from "./RedigeraBokningModal";

interface KalenderSchemaProps {
  bokningar: Array<
    Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null }
  >;
  lunchtider: Lunchtid[];
  foretagsslug: string;
  tjanst?: Tjanst;
  tjanster?: Tjanst[];
  utforare?: Utforare[];
  utforareTillganglighet?: UtforareTillganglighet[];
  selectedUtforareId?: string | null;
  onBookingCreated?: () => void;
  oppettider?: {
    [key: string]: {
      open: string;
      close: string;
      stangt: boolean;
    };
  } | null;
}

export function KalenderSchema({
  bokningar,
  lunchtider,
  foretagsslug,
  tjanst,
  tjanster = [],
  utforare = [],
  utforareTillganglighet = [],
  selectedUtforareId: selectedUtforareIdProp,
  onBookingCreated,
  oppettider,
}: KalenderSchemaProps) {
  const [dashboardModalOpen, setDashboardModalOpen] = React.useState(false);
  const [selectedDashboardSlot, setSelectedDashboardSlot] = React.useState<{
    date: Date;
    time: string;
  } | null>(null);
  const [selectedUtforareId, setSelectedUtforareId] = React.useState<string | null>(
    selectedUtforareIdProp || null
  );

  // Uppdatera state när prop ändras (från parent)
  React.useEffect(() => {
    if (selectedUtforareIdProp !== undefined) {
      setSelectedUtforareId(selectedUtforareIdProp);
    }
  }, [selectedUtforareIdProp]);

  const { weekStart, weekDays, goToPreviousWeek, goToNextWeek } = useKalenderNavigation();

  const { timeSlots, getBookingForSlot } = useBookingSlots(bokningar, oppettider, weekDays);

  const { isModalOpen, selectedSlot, handleSlotClick, closeModal } = useBookingModal(tjanst, () => {
    if (onBookingCreated) {
      onBookingCreated();
    }
  });

  const { selectedBooking, openBookingDetails, closeBookingDetails } = useBookingDetails();

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

  // Funktion för att kolla om tid är inom företagets öppettider
  const isWithinOpeningHours = (day: Date, timeSlot: string): boolean => {
    if (!oppettider) return true; // Om inga öppettider, tillåt allt

    const veckodagar = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];
    const veckodag = veckodagar[day.getDay()];
    const dagensOppettider = oppettider[veckodag];

    // Om inga öppettider finns för denna dag, använd default (08:00-17:00)
    if (!dagensOppettider) return true;

    // Om stängt denna dag, returnera false
    if (dagensOppettider.stangt) return false;

    const slotTime = timeSlot; // "HH:MM"
    const openTime = dagensOppettider.open; // "HH:MM"
    const closeTime = dagensOppettider.close; // "HH:MM"

    // Kolla om sloten är inom öppettiderna
    return slotTime >= openTime && slotTime < closeTime;
  };

  // Funktion för att kolla om tid är tillgänglig för vald utförare
  const isTimeAvailableForUtforare = (day: Date, timeSlot: string): boolean => {
    // Kolla först om tiden är inom öppettiderna
    if (!isWithinOpeningHours(day, timeSlot)) return false;

    // Om ingen utförare är vald, visa alla tider (som är inom öppettiderna)
    if (!selectedUtforareId) return true;

    // Hämta veckodag (måndag, tisdag, etc.)
    const veckodagar = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];
    const veckodag = veckodagar[day.getDay()];

    // Hitta tillgänglighet för vald utförare och denna veckodag
    const tillganglighet = utforareTillganglighet.find(
      (t) => t.utforareId === selectedUtforareId && t.veckodag === veckodag && !t.ledig
    );

    // Om ingen tillgänglighet finns för denna dag, visa inte tiden
    if (!tillganglighet) return false;

    // Kolla om tiden är inom utförarens arbetstider
    const slotTime = timeSlot; // "HH:MM"
    const startTime = tillganglighet.startTid?.substring(0, 5); // "HH:MM:SS" -> "HH:MM"
    const slutTime = tillganglighet.slutTid?.substring(0, 5);

    if (!startTime || !slutTime) return false;

    return slotTime >= startTime && slotTime < slutTime;
  };

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
                      className={`p-3 text-center sticky top-0 z-10 border-b-4 border-stone-300 ${
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

                      // Kolla om tiden är tillgänglig för vald utförare
                      const isAvailableForUtforare = isTimeAvailableForUtforare(day, timeSlot);
                      const isClickable = (tjanst || isDashboardMode) && isAvailableForUtforare;

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
                            className={`w-full h-full p-2 rounded-lg border-2 transition-all ${
                              isClickable
                                ? "border-emerald-400 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-500 hover:shadow-md cursor-pointer active:scale-95"
                                : "border-stone-200 bg-stone-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="text-center">
                              <div
                                className={`text-sm font-bold ${
                                  isClickable ? "text-emerald-700" : "text-stone-400"
                                }`}
                              >
                                {timeSlot}
                              </div>
                              {tjanst && isClickable && (
                                <div className="text-emerald-600 text-xs font-semibold">
                                  {tjanst.pris / 100} kr
                                </div>
                              )}
                              {!isAvailableForUtforare && selectedUtforareId && (
                                <div className="text-[10px] text-stone-400 mt-1">
                                  Ej tillgänglig
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
        <KundBokningModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedDate={selectedSlot.date}
          selectedTime={selectedSlot.time}
          tjanst={tjanst}
          utforare={utforare}
          onSuccess={() => {
            if (onBookingCreated) onBookingCreated();
          }}
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

      {/* Booking Details Dialog - now editable */}
      {selectedBooking && (
        <RedigeraBokningModal
          isOpen={!!selectedBooking}
          onClose={closeBookingDetails}
          bokning={selectedBooking}
          tjanster={tjanster}
          utforare={utforare}
          onUpdate={() => {
            closeBookingDetails();
            if (onBookingCreated) onBookingCreated();
          }}
        />
      )}

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
