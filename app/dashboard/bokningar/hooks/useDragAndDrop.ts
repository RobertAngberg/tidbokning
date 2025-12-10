import { useState } from "react";
import { format } from "date-fns/format";
import { useRouter } from "next/navigation";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import { flyttaBokning } from "../actions/bokningar";
import { flyttaLunch } from "../actions/lunchtider";

interface DraggedItem {
  type: "booking" | "lunch";
  booking?: Bokning & { kund: Kund | null; tjanst: Tjanst | null };
  sourceDate: Date;
  sourceTime: string;
}

interface DropTarget {
  date: Date;
  time: string;
}

export function useDragAndDrop(foretagsslug: string, onSuccess?: () => void) {
  const router = useRouter();
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [moveConfirmOpen, setMoveConfirmOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const handleDragStart = (
    e: React.DragEvent,
    type: "booking" | "lunch",
    date: Date,
    time: string,
    booking?: Bokning & { kund: Kund | null; tjanst: Tjanst | null }
  ) => {
    setDraggedItem({ type, booking, sourceDate: date, sourceTime: time });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date, targetTime: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Don't allow dropping on the same slot
    if (
      draggedItem.sourceDate.toISOString() === targetDate.toISOString() &&
      draggedItem.sourceTime === targetTime
    ) {
      setDraggedItem(null);
      return;
    }

    setDropTarget({ date: targetDate, time: targetTime });
    setMoveConfirmOpen(true);
  };

  const handleConfirmMove = async () => {
    if (!draggedItem || !dropTarget) return;

    // Handle lunch moves
    if (draggedItem.type === "lunch") {
      setIsMoving(true);

      const franDatum = format(draggedItem.sourceDate, "yyyy-MM-dd");
      const tillDatum = format(dropTarget.date, "yyyy-MM-dd");

      const result = await flyttaLunch(
        foretagsslug,
        franDatum,
        draggedItem.sourceTime,
        tillDatum,
        dropTarget.time
      );

      if (result.success) {
        router.refresh();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(`Fel vid flytt: ${result.error}`);
      }

      setIsMoving(false);
      setMoveConfirmOpen(false);
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    // Handle booking moves
    if (draggedItem.type === "booking" && draggedItem.booking) {
      setIsMoving(true);

      // Parse time string (HH:mm) and combine with date
      const [hours, minutes] = dropTarget.time.split(":").map(Number);
      const nyStartTid = new Date(dropTarget.date);
      nyStartTid.setHours(hours, minutes, 0, 0);

      const result = await flyttaBokning(draggedItem.booking.id, nyStartTid);

      if (result.success) {
        router.refresh();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(`Fel vid flytt: ${result.error}`);
      }

      setIsMoving(false);
      setMoveConfirmOpen(false);
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    // Cleanup if no valid type
    setMoveConfirmOpen(false);
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleCancelMove = () => {
    setMoveConfirmOpen(false);
    setDraggedItem(null);
    setDropTarget(null);
  };

  return {
    draggedItem,
    dropTarget,
    moveConfirmOpen,
    isMoving,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleConfirmMove,
    handleCancelMove,
  };
}
