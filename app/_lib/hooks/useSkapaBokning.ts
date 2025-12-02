"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { skapaBokning } from "../../_server/actions/bokningar";
import type { BokningInput } from "../validators/bokning";

export function useSkapaBokning() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BokningInput) => skapaBokning(data),
    onSuccess: () => {
      // Invalidera och refetch bokningar automatiskt
      queryClient.invalidateQueries({ queryKey: ["bokningar"] });
    },
  });
}
