"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
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

interface BokningarTabProps {
  bokningar: Array<Bokning & { kund: Kund | null; tjanst: Tjanst | null }>;
}

export function BokningarTab({ bokningar }: BokningarTabProps) {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <KalenderSchema bokningar={bokningar} />
      </div>
      <div>
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Bokningar</CardTitle>
            <CardDescription>
              {filteredBokningar.length} av {bokningar.length}{" "}
              {bokningar.length === 1 ? "bokning" : "bokningar"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 overflow-auto">
            <Input
              placeholder="Sök på namn, email eller tjänst..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Alla status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alla">Alla status</SelectItem>
                <SelectItem value="Bekräftad">Bekräftad</SelectItem>
                <SelectItem value="Väntande">Väntande</SelectItem>
                <SelectItem value="Inställd">Inställd</SelectItem>
                <SelectItem value="Slutförd">Slutförd</SelectItem>
              </SelectContent>
            </Select>

            {filteredBokningar.length === 0 ? (
              <p className="text-muted-foreground text-sm">Inga bokningar hittades</p>
            ) : (
              <div className="space-y-4">
                {filteredBokningar.map((bokning) => (
                  <div key={bokning.id} className="border rounded-lg p-4 space-y-3">
                    <div>
                      <p className="font-medium">{bokning.kund?.namn}</p>
                      <p className="text-sm text-muted-foreground">{bokning.kund?.email}</p>
                      <p className="text-sm text-muted-foreground">{bokning.tjanst?.namn}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(bokning.startTid), "PPP 'kl' HH:mm", { locale: sv })}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <Select
                        value={bokning.status}
                        onValueChange={(value) => handleStatusChange(bokning.id, value)}
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bekräftad">Bekräftad</SelectItem>
                          <SelectItem value="Väntande">Väntande</SelectItem>
                          <SelectItem value="Inställd">Inställd</SelectItem>
                          <SelectItem value="Slutförd">Slutförd</SelectItem>
                        </SelectContent>
                      </Select>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Radera bokning?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Detta går inte att ångra. Bokningen kommer att raderas permanent.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(bokning.id)}>
                              Radera
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
