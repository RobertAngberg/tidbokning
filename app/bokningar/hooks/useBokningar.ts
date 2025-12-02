"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  hämtaBokningar,
  skapaBokning,
  uppdateraBokningsstatus,
  raderaBokning,
  hämtaTillgängligaTider,
} from "../actions/bokningar";
import type { BokningInput } from "../validators/bokning";
import type { Bokning } from "../schema/bokningar";

type BokningResult = { success: true; bokning: Bokning } | { success: false; error: string };

// Query: Hämta alla bokningar
export function useBokningar() {
  return useQuery({
    queryKey: ["bokningar"],
    queryFn: () => hämtaBokningar(),
  });
}

// Query: Hämta tillgängliga tider för ett datum och tjänst
export function useTillgangligaTider(datum: Date | undefined, tjanstId: string) {
  return useQuery({
    queryKey: ["tillgangliga-tider", datum?.toISOString(), tjanstId],
    queryFn: () => {
      if (!datum || !tjanstId) return [];
      return hämtaTillgängligaTider(datum, tjanstId);
    },
    enabled: !!datum && !!tjanstId,
  });
}

// Mutation: Skapa ny bokning
export function useSkapaBokning(onSuccess?: (result: BokningResult) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BokningInput) => skapaBokning(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["bokningar"] });
      queryClient.invalidateQueries({ queryKey: ["tillgangliga-tider"] });
      if (onSuccess) {
        onSuccess(result);
      }
    },
  });
}

// Mutation: Uppdatera bokningsstatus
export function useUppdateraBokningsstatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bokningId,
      status,
    }: {
      bokningId: string;
      status: "bekraftad" | "vaentande" | "installld" | "slutford";
    }) => uppdateraBokningsstatus(bokningId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bokningar"] });
    },
  });
}

// Mutation: Radera bokning
export function useRaderaBokning() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bokningId: string) => raderaBokning(bokningId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bokningar"] });
      queryClient.invalidateQueries({ queryKey: ["tillgangliga-tider"] });
    },
  });
}
