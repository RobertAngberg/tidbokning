"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/Card";
import { Input } from "@/_components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/Select";
import { useBokningar } from "@/_lib/hooks/useBokningar";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export function BokningsLista() {
  const { data: bokningar = [], isLoading } = useBokningar();
  const [filter, setFilter] = useState<string>("alla");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBokningar = bokningar.filter((bokning) => {
    const matchesStatus = filter === "alla" || bokning.status === filter;
    const matchesSearch =
      bokning.kund?.namn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bokning.kund?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bokning.tjanst?.namn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "bekraftad":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "vaentande":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "installld":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "slutford":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bokningar</CardTitle>
        <CardDescription>
          {filteredBokningar.length} av {bokningar.length}{" "}
          {bokningar.length === 1 ? "bokning" : "bokningar"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            {filteredBokningar.map((bokning) => (
              <div key={bokning.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{bokning.kund?.namn}</p>
                    <p className="text-sm text-muted-foreground">{bokning.kund?.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {bokning.tjanst?.namn} •{" "}
                      {format(new Date(bokning.startTid), "PPP 'kl' HH:mm", { locale: sv })}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusBadgeColor(bokning.status)}`}
                  >
                    {bokning.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
