"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/Card";
import { Input } from "@/_components/Input";
import { Label } from "@/_components/Label";
import { Button } from "@/_components/Button";
import { DatePicker } from "@/_components/DatePicker";
import { TimePicker } from "@/_components/TimePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/Select";
import { useSkapaBokning } from "@/_lib/hooks/useSkapaBokning";
import type { Tjanst } from "@/_server/db/schema";

export function BokningsFormular({ tjänster }: { tjänster: Tjanst[] }) {
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTjänst, setSelectedTjänst] = useState("");
  const skapaBokning = useSkapaBokning();

  // Auto-fyll tiden med nästa hela timme
  useEffect(() => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    setSelectedTime(`${nextHour.getHours().toString().padStart(2, "0")}:00`);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!selectedDate) {
      setMessage("❌ Välj ett datum");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTid = new Date(selectedDate);
    startTid.setHours(hours, minutes, 0, 0);

    skapaBokning.mutate(
      {
        kundNamn: formData.get("namn") as string,
        kundEmail: formData.get("email") as string,
        tjänstId: selectedTjänst,
        startTid,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            setMessage("✅ Bokningen är klar!");
            (e.target as HTMLFormElement).reset();
            setSelectedDate(new Date());
          } else {
            setMessage(result.error);
          }
        },
        onError: () => {
          setMessage("❌ Något gick fel");
        },
      }
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Boka en tid</CardTitle>
        <CardDescription>Fyll i formuläret för att skapa en ny bokning</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tjanst">Välj tjänst</Label>
            <Select value={selectedTjänst} onValueChange={setSelectedTjänst} required>
              <SelectTrigger>
                <SelectValue placeholder="Välj en tjänst..." />
              </SelectTrigger>
              <SelectContent>
                {tjänster.map((tjänst) => (
                  <SelectItem key={tjänst.id} value={tjänst.id}>
                    {tjänst.namn} ({tjänst.varaktighet} min) - {tjänst.pris / 100} kr
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="namn">Ditt namn</Label>
            <Input id="namn" name="namn" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Din email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Datum</Label>
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tid</Label>
              <TimePicker value={selectedTime} onChange={setSelectedTime} />
            </div>
          </div>

          <Button type="submit" disabled={skapaBokning.isPending} className="w-full">
            {skapaBokning.isPending ? "Bokar..." : "Boka tid"}
          </Button>

          {message && (
            <p className={message.includes("✅") ? "text-green-600" : "text-red-600"}>{message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
