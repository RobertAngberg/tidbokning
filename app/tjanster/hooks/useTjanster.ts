"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  hämtaAllaTjanster,
  skapaTjänst,
  uppdateraTjänst,
  toggleTjänstAktiv,
  raderaTjänst,
} from "../actions/tjanster";
import type { Tjanst } from "../schema/tjanster";

interface SkapaTjänstInput {
  namn: string;
  beskrivning: string;
  varaktighet: number;
  pris: number;
  foretagsslug: string;
}

interface UppdateraTjänstInput {
  id: string;
  data: {
    namn?: string;
    beskrivning?: string;
    varaktighet?: number;
    pris?: number;
  };
}

type TjänstResult = { success: true; tjänst: Tjanst } | { success: false; error: string };

// Query: Hämta alla tjänster
export function useTjanster() {
  return useQuery({
    queryKey: ["tjanster"],
    queryFn: () => hämtaAllaTjanster(),
  });
}

// Mutation: Skapa ny tjänst
export function useSkapaTjanst(onSuccess?: (result: TjänstResult) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SkapaTjänstInput) => skapaTjänst(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["tjanster"] });
      if (onSuccess) {
        onSuccess(result);
      }
    },
  });
}

// Mutation: Uppdatera tjänst
export function useUppdateraTjanst() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UppdateraTjänstInput) => uppdateraTjänst(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tjanster"] });
    },
  });
}

// Mutation: Toggle tjänst aktiv/inaktiv
export function useToggleTjanstAktiv() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleTjänstAktiv(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tjanster"] });
    },
  });
}

// Mutation: Radera tjänst
export function useRaderaTjanst() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => raderaTjänst(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tjanster"] });
    },
  });
}
