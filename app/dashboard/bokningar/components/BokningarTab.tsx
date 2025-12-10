"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Lunchtid } from "../../../_server/db/schema/lunchtider";
import { KalenderSchema } from "./KalenderSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../_components/Card";
import { Input } from "../../../_components/Input";
import { Button } from "../../../_components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../_components/Select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../_components/AlertDialog";
import { uppdateraBokningsstatus, raderaBokning } from "../actions/bokningar";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import type { Utforare } from "../../../_server/db/schema/utforare";

interface BokningarTabProps {
  bokningar: Array<
    Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null }
  >;
  tjanster: Tjanst[];
  utforare: Utforare[];
  lunchtider: Lunchtid[];
  foretagsslug: string;
}

export function BokningarTab({
  bokningar,
  tjanster,
  utforare,
  lunchtider,
  foretagsslug,
}: BokningarTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<string>("alla");
  const [searchTerm, setSearchTerm] = useState("");

  // Refresh data när komponenten mountas
  useEffect(() => {
    router.refresh();
  }, [router]);

  const handleStatusChange = (bokningId: string, newStatus: string) => {
    startTransition(async () => {
      await uppdateraBokningsstatus(
        bokningId,
        newStatus as "Bekräftad" | "Väntande" | "Inställd" | "Slutförd"
      );
      router.refresh();
    });
  };

  const handleDelete = (bokningId: string) => {
    startTransition(async () => {
      await raderaBokning(bokningId);
      router.refresh();
    });
  };

  const filteredBokningar = bokningar.filter((bokning) => {
    const matchesStatus = filter === "alla" || bokning.status === filter;
    const matchesSearch =
      bokning.kund?.namn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bokning.kund?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bokning.tjanst?.namn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <KalenderSchema
        bokningar={bokningar}
        lunchtider={lunchtider}
        foretagsslug={foretagsslug}
        tjanster={tjanster}
        utforare={utforare}
        onBookingCreated={() => router.refresh()}
      />
    </div>
  );
}
