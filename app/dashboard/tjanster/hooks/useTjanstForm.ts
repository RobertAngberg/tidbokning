import { useActionState, useEffect } from "react";
import type { Tjanst } from "../../../_server/db/schema/tjanster";

interface UseTjanstFormProps {
  tjanst?: Tjanst;
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

export function useTjanstForm({ tjanst, action, onClose }: UseTjanstFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  // Stäng modal vid success
  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  // Hantera kategori-val (returnerar callback function)
  const createKategoriSelectHandler = (setKategoriInput: (value: string) => void) => {
    return (kategori: string) => {
      setKategoriInput(kategori);
    };
  };

  return {
    // State
    state,
    isPending,
    tjanst,

    // Actions
    formAction,
    createKategoriSelectHandler,
  };
}
