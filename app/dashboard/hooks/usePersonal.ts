"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { skapaPersonal, uppdateraPersonal, raderaPersonal } from "../actions/personal";
import type { PersonalInput } from "../validators/personal";

export function useSkapaPersonal() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: PersonalInput) => {
      const result = await skapaPersonal(data);
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

export function useUppdateraPersonal() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PersonalInput }) => {
      const result = await uppdateraPersonal(id, data);
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

export function useRaderaPersonal() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await raderaPersonal(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      router.refresh();
    },
  });
}
