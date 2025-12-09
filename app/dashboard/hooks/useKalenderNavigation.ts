import { useState } from "react";
import { startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";

export function useKalenderNavigation() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  return {
    currentDate,
    weekStart,
    weekDays,
    goToPreviousWeek,
    goToNextWeek,
  };
}
