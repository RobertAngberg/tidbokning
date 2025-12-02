"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../_components/Card";
import { Badge } from "../../_components/Badge";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import type { Bokning } from "../types";
import type { Anvandare } from "../../anvandare/types";
import type { Tjanst } from "../../tjanster/types";

interface BokningsSchemaProps {
  bokningar: Array<Bokning & { kund: Anvandare | null; tjanst: Tjanst | null }>;
}

export function BokningsSchema({ bokningar }: BokningsSchemaProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Hitta bokningar för valt datum
  const bokningarForDatum = selectedDate
    ? bokningar.filter((bokning) => {
        const bokningDate = new Date(bokning.startTid);
        return (
          bokningDate.getFullYear() === selectedDate.getFullYear() &&
          bokningDate.getMonth() === selectedDate.getMonth() &&
          bokningDate.getDate() === selectedDate.getDate()
        );
      })
    : [];

  // Sortera bokningar efter starttid
  const sorteradeBokningar = bokningarForDatum.sort(
    (a, b) => new Date(a.startTid).getTime() - new Date(b.startTid).getTime()
  );

  // Hitta dagar med bokningar för att markera i kalendern
  const daysWithBookings = bokningar.map((bokning) => new Date(bokning.startTid));

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

  // Navigering
  const goToPreviousMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(year, month + 1, 1));
  };

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

  return (
    <Card className="overflow-hidden border-stone-200">
      <CardHeader className="bg-gradient-to-r from-white via-amber-50/20 to-white">
        <CardTitle className="text-2xl text-stone-800">Bokningsschema</CardTitle>
        <CardDescription className="text-stone-600">
          Välj ett datum för att se dagens bokningar
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Custom Kalender */}
          <div className="w-full bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
            {/* Månad navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPreviousMonth}
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
              <h2 className="text-2xl font-bold text-stone-800">
                {format(currentMonth, "MMMM yyyy", { locale: sv })}
              </h2>
              <button
                onClick={goToNextMonth}
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

            {/* Veckodagar */}
            <div className="grid grid-cols-7 gap-3 mb-3">
              {["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"].map((day, idx) => (
                <div
                  key={day}
                  className={`text-center text-xs font-bold uppercase tracking-wider py-2 ${
                    idx >= 5 ? "text-amber-700/70" : "text-stone-600"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Dagar grid */}
            <div className="grid grid-cols-7 gap-3">
              {/* Tomma celler före första dagen */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Alla dagar */}
              {days.map((date) => {
                const selected = isSelected(date);
                const booked = hasBooking(date);

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      relative h-12 p-2 rounded-xl text-sm font-semibold
                      transition-all duration-200
                      ${
                        selected
                          ? "bg-amber-50 text-stone-800 scale-110 border border-amber-300 border-dashed"
                          : "bg-white text-stone-700 border border-transparent hover:bg-amber-50/50 hover:scale-105"
                      }
                      active:scale-95
                    `}
                  >
                    <span className="absolute inset-0 flex items-center justify-center">
                      {date.getDate()}
                    </span>
                    {booked && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dagens bokningar */}
          <div className="space-y-4 border-t border-stone-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl text-stone-800">
                  {selectedDate
                    ? format(selectedDate, "EEEE d MMMM yyyy", { locale: sv })
                    : "Välj ett datum"}
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  {sorteradeBokningar.length}{" "}
                  {sorteradeBokningar.length === 1 ? "bokning" : "bokningar"}
                </p>
              </div>
              {sorteradeBokningar.length > 0 && (
                <div className="text-sm font-medium text-stone-600">
                  Totalt:{" "}
                  <span className="text-stone-800 font-bold">
                    {sorteradeBokningar.reduce((sum, b) => sum + (b.tjanst?.pris || 0), 0) / 100} kr
                  </span>
                </div>
              )}
            </div>

            {sorteradeBokningar.length === 0 ? (
              <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="font-medium">Inga bokningar detta datum</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sorteradeBokningar.map((bokning) => (
                  <div
                    key={bokning.id}
                    className="group relative border-2 border-stone-200 rounded-xl p-5 hover:bg-amber-50/30 transition-all hover:shadow-md hover:border-amber-200"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-amber-400 rounded-l-xl" />
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 pl-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                            <svg
                              className="w-4 h-4 text-amber-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-bold text-base text-stone-800">
                              {format(new Date(bokning.startTid), "HH:mm", { locale: sv })}
                            </span>
                            <span className="text-stone-400">→</span>
                            <span className="font-semibold text-stone-600">
                              {format(new Date(bokning.slutTid), "HH:mm", { locale: sv })}
                            </span>
                          </div>
                          <Badge variant={statusVariant(bokning.status)} className="shadow-sm">
                            {statusText(bokning.status)}
                          </Badge>
                        </div>
                        <p className="font-semibold text-lg mb-1 text-stone-800">
                          {bokning.kund?.namn}
                        </p>
                        <p className="text-sm text-stone-600 mb-3">{bokning.kund?.email}</p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg">
                            <span className="text-sm font-bold text-stone-700">
                              {bokning.tjanst?.namn}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stone-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{bokning.tjanst?.varaktighet} min</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{bokning.tjanst && bokning.tjanst.pris / 100} kr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
