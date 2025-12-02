"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/Card";
import { Calendar } from "@/_components/Calendar";
import { Badge } from "@/_components/Badge";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import type { Bokning, Anvandare, Tjanst } from "@/_server/db/schema";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bokningsschema</CardTitle>
        <CardDescription>Välj ett datum för att se dagens bokningar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Kalender */}
          <div className="flex-shrink-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={sv}
              weekStartsOn={1}
              modifiers={{
                booked: daysWithBookings,
              }}
              modifiersClassNames={{
                booked: "bg-primary/10 font-bold",
              }}
              className="rounded-md border"
            />
          </div>

          {/* Dagens bokningar */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                {selectedDate
                  ? format(selectedDate, "EEEE d MMMM yyyy", { locale: sv })
                  : "Välj ett datum"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {sorteradeBokningar.length}{" "}
                {sorteradeBokningar.length === 1 ? "bokning" : "bokningar"}
              </p>
            </div>

            {sorteradeBokningar.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Inga bokningar detta datum</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sorteradeBokningar.map((bokning) => (
                  <div
                    key={bokning.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-lg">
                            {format(new Date(bokning.startTid), "HH:mm", { locale: sv })}
                          </span>
                          <span className="text-muted-foreground">-</span>
                          <span className="text-muted-foreground">
                            {format(new Date(bokning.slutTid), "HH:mm", { locale: sv })}
                          </span>
                          <Badge variant={statusVariant(bokning.status)}>
                            {statusText(bokning.status)}
                          </Badge>
                        </div>
                        <p className="font-medium">{bokning.kund?.namn}</p>
                        <p className="text-sm text-muted-foreground">{bokning.kund?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-medium text-primary">
                            {bokning.tjanst?.namn}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {bokning.tjanst?.varaktighet} min
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {bokning.tjanst && bokning.tjanst.pris / 100} kr
                          </span>
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
