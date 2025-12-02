"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../_components/Card";
import { Button } from "../_components/Button";
import { Calendar } from "../_components/Calendar";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { hämtaTillgängligaTider } from "../_server/actions/bokningar";
import type { Tjanst } from "../_server/db/schema";

interface BokningsKalenderProps {
  tjänster: Tjanst[];
  onSelectTime: (date: Date, tjanstId: string) => void;
}

interface TillgängligTid {
  tid: string;
  tillgänglig: boolean;
}

export function BokningsKalender({ tjänster, onSelectTime }: BokningsKalenderProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTjanst, setSelectedTjanst] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<TillgängligTid[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadTimes() {
      if (selectedDate && selectedTjanst) {
        setIsLoading(true);
        try {
          const times = await hämtaTillgängligaTider(selectedDate, selectedTjanst);
          setAvailableTimes(times);
        } catch (error) {
          console.error("Fel vid hämtning av tider:", error);
          setAvailableTimes([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAvailableTimes([]);
      }
    }
    loadTimes();
  }, [selectedDate, selectedTjanst]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTjanstChange = (tjanstId: string) => {
    setSelectedTjanst(tjanstId);
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes, 0, 0);
    onSelectTime(dateTime, selectedTjanst);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Välj tid från kalender</CardTitle>
        <CardDescription>Välj datum och se tillgängliga tider</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Välj tjänst</label>
          <select
            value={selectedTjanst}
            onChange={(e) => handleTjanstChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">Välj en tjänst...</option>
            {tjänster.map((tjänst) => (
              <option key={tjänst.id} value={tjänst.id}>
                {tjänst.namn} ({tjänst.varaktighet} min) - {tjänst.pris / 100} kr
              </option>
            ))}
          </select>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          locale={sv}
          className="rounded-md border"
        />

        {selectedDate && selectedTjanst && (
          <div>
            <p className="text-sm font-medium mb-2">
              {isLoading
                ? "Laddar tider..."
                : `Tillgängliga tider ${format(selectedDate, "PPP", { locale: sv })}`}
            </p>
            {availableTimes.length === 0 && !isLoading ? (
              <p className="text-sm text-muted-foreground">Inga tider tillgängliga</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((timeSlot) => (
                  <Button
                    key={timeSlot.tid}
                    variant={timeSlot.tillgänglig ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => handleTimeSelect(timeSlot.tid)}
                    disabled={!timeSlot.tillgänglig}
                    className="w-full"
                  >
                    {timeSlot.tid}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
