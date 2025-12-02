"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../_components/Card";
import { Input } from "../../_components/Input";
import { Button } from "../../_components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../_components/Select";
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
} from "../../_components/AlertDialog";
import { useBokningar, useUppdateraBokningsstatus, useRaderaBokning } from "../hooks/useBokningar";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import type { Bokning } from "../../_server/db/schema/bokningar";
import type { Anvandare } from "../../_server/db/schema/anvandare";
import type { Tjanst } from "../../_server/db/schema/tjanster";

interface BokningsListaProps {
  bokningar?: Array<Bokning & { kund: Anvandare | null; tjanst: Tjanst | null }>;
}

export function BokningsLista({ bokningar: initialBokningar }: BokningsListaProps = {}) {
  const { data: fetchedBokningar = [], isLoading } = useBokningar();
  const uppdateraStatus = useUppdateraBokningsstatus();
  const raderaBokning = useRaderaBokning();
  const bokningar = initialBokningar || fetchedBokningar;
  const [filter, setFilter] = useState<string>("alla");
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = (bokningId: string, newStatus: string) => {
    uppdateraStatus.mutate({
      bokningId,
      status: newStatus as "bekraftad" | "vaentande" | "installld" | "slutford",
    });
  };

  const handleDelete = (bokningId: string) => {
    raderaBokning.mutate(bokningId);
  };

  const filteredBokningar = bokningar.filter((bokning: (typeof bokningar)[0]) => {
    const matchesStatus = filter === "alla" || bokning.status === filter;
    const matchesSearch =
      bokning.kund?.namn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bokning.kund?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bokning.tjanst?.namn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Bokningar</CardTitle>
        <CardDescription>
          {filteredBokningar.length} av {bokningar.length}{" "}
          {bokningar.length === 1 ? "bokning" : "bokningar"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-auto">
        <div className="flex gap-4">
          <Input
            placeholder="Sök på namn, email eller tjänst..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alla status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alla">Alla status</SelectItem>
              <SelectItem value="bekraftad">Bekräftad</SelectItem>
              <SelectItem value="vaentande">Väntande</SelectItem>
              <SelectItem value="installld">Inställd</SelectItem>
              <SelectItem value="slutford">Slutförd</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Laddar bokningar...</p>
        ) : filteredBokningar.length === 0 ? (
          <p className="text-muted-foreground text-sm">Inga bokningar hittades</p>
        ) : (
          <div className="space-y-4">
            {filteredBokningar.map((bokning: (typeof bokningar)[0]) => (
              <div key={bokning.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{bokning.kund?.namn}</p>
                    <p className="text-sm text-muted-foreground">{bokning.kund?.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {bokning.tjanst?.namn} •{" "}
                      {format(new Date(bokning.startTid), "PPP 'kl' HH:mm", { locale: sv })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={bokning.status}
                      onValueChange={(value) => handleStatusChange(bokning.id, value)}
                      disabled={uppdateraStatus.isPending}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bekraftad">Bekräftad</SelectItem>
                        <SelectItem value="vaentande">Väntande</SelectItem>
                        <SelectItem value="installld">Inställd</SelectItem>
                        <SelectItem value="slutford">Slutförd</SelectItem>
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
