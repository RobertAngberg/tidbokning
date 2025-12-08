"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { skapaUtförare, uppdateraUtförare, raderaUtförare } from "../actions/utforare";

export function useSkapaUtförare() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      namn: string;
      email?: string;
      telefon?: string;
      beskrivning?: string;
      bildUrl?: string;
      aktiv: boolean;
    }) => {
      const result = await skapaUtförare(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });
}

export function useUppdateraUtförare() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        namn: string;
        email?: string;
        telefon?: string;
        beskrivning?: string;
        bildUrl?: string;
        aktiv: boolean;
      };
    }) => {
      const result = await uppdateraUtförare(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });
}

export function useRaderaUtförare() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await raderaUtförare(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      router.refresh();
    },
  });
}
