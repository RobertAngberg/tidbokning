"use client";

import * as React from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/_lib/utils";
import { Button } from "@/_components/ui/Button";
import { Calendar } from "@/_components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/_components/ui/Popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export function DatePicker({ date, onDateChange, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn(
            "w-full justify-start text-left font-normal",
            "data-[empty=true]:text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP", { locale: sv }) : <span>Välj datum</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={disabled}
          locale={sv}
          weekStartsOn={1}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
