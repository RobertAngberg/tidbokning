"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/Card";
import { Button } from "@/_components/ui/Button";
import { toggleTjänstAktiv } from "@/_server/actions/tjanster";
import type { Tjanst } from "@/_server/db/schema";

interface TjansterListaProps {
  tjänster: Tjanst[];
}

export function TjansterLista({ tjänster }: TjansterListaProps) {
  async function handleToggle(id: string) {
    await toggleTjänstAktiv(id);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alla tjänster ({tjänster.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {tjänster.length === 0 ? (
          <p className="text-muted-foreground text-sm">Inga tjänster skapade än</p>
        ) : (
          <div className="space-y-4">
            {tjänster.map((tjanst) => (
              <div key={tjanst.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{tjanst.namn}</h3>
                    {tjanst.beskrivning && (
                      <p className="text-sm text-muted-foreground">{tjanst.beskrivning}</p>
                    )}
                  </div>
                  <Button
                    variant={tjanst.aktiv === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggle(tjanst.id)}
                  >
                    {tjanst.aktiv === 1 ? "Aktiv" : "Inaktiv"}
                  </Button>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>⏱️ {tjanst.varaktighet} min</span>
                  <span>💰 {tjanst.pris / 100} kr</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
