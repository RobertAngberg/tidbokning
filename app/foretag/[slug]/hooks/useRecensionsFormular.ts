import { useState } from "react";
import { skapaRecension } from "../../../dashboard/recensioner/actions/recensioner";

interface Message {
  type: "success" | "error";
  text: string;
}

export function useRecensionsFormular(foretagsslug: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [kundEmail, setKundEmail] = useState("");
  const [betyg, setBetyg] = useState(0);
  const [hoveredBetyg, setHoveredBetyg] = useState(0);
  const [kommentar, setKommentar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const resetForm = () => {
    setKundEmail("");
    setBetyg(0);
    setKommentar("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const result = await skapaRecension({
      kundEmail,
      foretagsslug,
      betyg,
      kommentar: kommentar.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setMessage({ type: "success", text: "Tack för din recension!" });
      resetForm();
      // Close form after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 2000);
    } else {
      setMessage({ type: "error", text: result.error || "Något gick fel" });
    }
  };

  const closeForm = () => {
    setIsOpen(false);
    setMessage(null);
  };

  return {
    isOpen,
    setIsOpen,
    kundEmail,
    setKundEmail,
    betyg,
    setBetyg,
    hoveredBetyg,
    setHoveredBetyg,
    kommentar,
    setKommentar,
    isSubmitting,
    message,
    handleSubmit,
    closeForm,
  };
}
