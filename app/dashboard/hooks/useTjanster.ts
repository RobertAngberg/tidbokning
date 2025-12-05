import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { skapaTjänst, uppdateraTjänst, raderaTjänst } from "../actions/tjanster";

export function useSkapaTjänst() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      namn: string;
      beskrivning: string;
      varaktighet: number;
      pris: number;
      kategori: string;
      aktiv: boolean;
    }) => {
      const result = await skapaTjänst(data);
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

export function useUppdateraTjänst() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        namn: string;
        beskrivning: string;
        varaktighet: number;
        pris: number;
        kategori: string;
        aktiv: boolean;
      };
    }) => {
      const result = await uppdateraTjänst(id, data);
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

export function useRaderaTjänst() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await raderaTjänst(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      router.refresh();
    },
  });
}
