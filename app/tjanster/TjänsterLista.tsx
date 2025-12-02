"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/Card";
import { Button } from "@/_components/Button";
import { Input } from "@/_components/Input";
import { Label } from "@/_components/Label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/Dialog";
import { toggleTjänstAktiv, uppdateraTjänst, raderaTjänst } from "@/_server/actions/tjanster";
import type { Tjanst } from "@/_server/db/schema";
import { Pencil, Trash2 } from "lucide-react";

interface TjansterListaProps {
  tjänster: Tjanst[];
}

export function TjansterLista({ tjänster }: TjansterListaProps) {
  const [editingTjänst, setEditingTjänst] = useState<Tjanst | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleToggle(id: string) {
    await toggleTjänstAktiv(id);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingTjänst) return;

    const formData = new FormData(e.currentTarget);
    await uppdateraTjänst(editingTjänst.id, {
      namn: formData.get("namn") as string,
      beskrivning: formData.get("beskrivning") as string,
      varaktighet: Number(formData.get("varaktighet")),
      pris: Number(formData.get("pris")),
    });

    setIsDialogOpen(false);
    setEditingTjänst(null);
  }

  async function handleDelete(id: string) {
    await raderaTjänst(id);
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
                  <div className="flex gap-2">
                    <Button
                      variant={tjanst.aktiv === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggle(tjanst.id)}
                    >
                      {tjanst.aktiv === 1 ? "Aktiv" : "Inaktiv"}
                    </Button>
                    <Dialog
                      open={isDialogOpen && editingTjänst?.id === tjanst.id}
                      onOpenChange={setIsDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingTjänst(tjanst)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <form onSubmit={handleUpdate}>
                          <DialogHeader>
                            <DialogTitle>Redigera tjänst</DialogTitle>
                            <DialogDescription>Ändra information för tjänsten</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="namn">Namn på tjänst</Label>
                              <Input id="namn" name="namn" defaultValue={tjanst.namn} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="beskrivning">Beskrivning</Label>
                              <Input
                                id="beskrivning"
                                name="beskrivning"
                                defaultValue={tjanst.beskrivning || ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="varaktighet">Varaktighet (minuter)</Label>
                              <Input
                                id="varaktighet"
                                name="varaktighet"
                                type="number"
                                min="15"
                                defaultValue={tjanst.varaktighet}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="pris">Pris (kr)</Label>
                              <Input
                                id="pris"
                                name="pris"
                                type="number"
                                min="0"
                                step="0.01"
                                defaultValue={tjanst.pris / 100}
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Spara ändringar</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(tjanst.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
