"use client";

import { useQuery } from "@tanstack/react-query";
import { hämtaBokningar } from "../../_server/actions/bokningar";

export function useBokningar() {
  return useQuery({
    queryKey: ["bokningar"],
    queryFn: () => hämtaBokningar(),
    // Refetch vid window focus istället för på intervall
    refetchOnWindowFocus: true,
  });
}
