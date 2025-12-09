"use client";

import { Card, CardContent } from "../../_components/Card";
import { Badge } from "../../_components/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../_components/Dialog";
import { format, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import type { Bokning } from "../../_server/db/schema/bokningar";
import type { Anvandare } from "../../_server/db/schema/anvandare";
import type { Tjanst } from "../../_server/db/schema/tjanster";
import type { Utforare } from "../../_server/db/schema/utforare";
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

  const { timeSlots, getBookingForSlot, isFirstSlotForBooking, getBookingSlotSpan } =
    useBookingSlots(bokningar);

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
                    const isFirstSlot = isFirstSlotForBooking(booking, day, timeSlot);
                    const slotSpan = booking && isFirstSlot ? getBookingSlotSpan(booking) : 1;

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
                        } transition-colors relative`}
                      >
                        {booking && isFirstSlot ? (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              openBookingDetails(booking);
                            }}
                            className="bg-amber-100 border border-amber-300 rounded p-2 text-xs absolute inset-2 overflow-hidden cursor-pointer hover:bg-amber-200 transition-colors"
                            style={{
                              height: `calc(${slotSpan * 60}px - 16px)`,
                              zIndex: 10,
                            }}
                          >
                            <div className="font-bold text-stone-800 truncate mb-1">
                              {booking.kund?.namn}
                            </div>
                            <div className="text-stone-600 truncate text-[10px]">
                              {booking.tjanst?.namn}
                            </div>
                            <div className="text-stone-500 text-[10px]">
                              {format(new Date(booking.startTid), "HH:mm")} -{" "}
                              {format(new Date(booking.slutTid), "HH:mm")}
                            </div>
                            <Badge
                              variant={statusVariant(booking.status)}
                              className="text-[9px] mt-1 px-1 py-0"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        ) : booking && !isFirstSlot ? null : tjanst ? ( // Tom div för slots som är täckta av en bokning ovan
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
