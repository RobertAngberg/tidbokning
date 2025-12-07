"use client";

import { useState } from "react";
import { Card } from "../../_components/Card";
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
import { TjanstFormModal } from "./TjanstFormModal";
import { useSkapaTjänst, useUppdateraTjänst, useRaderaTjänst } from "../hooks/useTjanster";
import type { Tjanst } from "../../_server/db/schema/tjanster";
import { Pencil, Trash2 } from "lucide-react";

interface TjansterTabProps {
  tjanster: Tjanst[];
}

interface TjanstFormData {
  namn: string;
  beskrivning: string;
  varaktighet: number;
  pris: number;
  kategori: string;
  aktiv: boolean;
}

export function TjansterTab({ tjanster }: TjansterTabProps) {
  const skapaTjanst = useSkapaTjänst();
  const uppdateraTjanst = useUppdateraTjänst();
  const raderaTjanst = useRaderaTjänst();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTjanst, setEditingTjanst] = useState<Tjanst | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState<string>("alla");
  const [visaInaktiva, setVisaInaktiva] = useState(false);

  const kategorier = Array.from(new Set(tjanster.map((t) => t.kategori).filter(Boolean)));

  const filteredTjanster = tjanster.filter((tjanst) => {
    const matchesSearch =
      tjanst.namn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tjanst.beskrivning?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKategori = kategoriFilter === "alla" || tjanst.kategori === kategoriFilter;
    const matchesAktiv = visaInaktiva || tjanst.aktiv === 1;
    return matchesSearch && matchesKategori && matchesAktiv;
  });

  const groupedTjanster = filteredTjanster.reduce((acc, tjanst) => {
    const kategori = tjanst.kategori || "Övrigt";
    if (!acc[kategori]) acc[kategori] = [];
    acc[kategori].push(tjanst);
    return acc;
  }, {} as Record<string, Tjanst[]>);

  const handleCreate = async (data: TjanstFormData) => {
    skapaTjanst.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = async (data: TjanstFormData) => {
    if (!editingTjanst) return;
    uppdateraTjanst.mutate(
      { id: editingTjanst.id, data },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingTjanst(undefined);
        },
      }
    );
  };

  const handleDelete = async (id: string) => {
    raderaTjanst.mutate(id);
  };

  const openCreateModal = () => {
    setEditingTjanst(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (tjanst: Tjanst) => {
    setEditingTjanst(tjanst);
    setIsModalOpen(true);
  };

  const isLoading = skapaTjanst.isPending || uppdateraTjanst.isPending;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap items-center">
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 font-medium"
        >
          + Lägg till tjänst
        </button>
        <input
          type="text"
          placeholder="Sök tjänster..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background text-foreground flex-1 min-w-[200px]"
        />
        <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Alla kategorier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alla">Alla kategorier</SelectItem>
            {kategorier.map((kat) => (
              <SelectItem key={kat} value={kat || ""}>
                {kat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={visaInaktiva}
            onChange={(e) => setVisaInaktiva(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-white">Visa inaktiva</span>
        </label>
      </div>

      {Object.keys(groupedTjanster).length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">Inga tjänster hittades</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedTjanster).map(([kategori, tjansterIKategori]) => (
            <div key={kategori}>
              <h3 className="text-xl font-semibold mb-4 text-white">{kategori}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tjansterIKategori.map((tjanst) => (
                  <Card key={tjanst.id} className="p-4 relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{tjanst.namn}</h4>
                        {tjanst.aktiv === 0 && (
                          <span className="text-xs text-muted-foreground">(Inaktiv)</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(tjanst)}
                          className="p-1 hover:bg-accent rounded"
                          title="Redigera"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="p-1 hover:bg-accent rounded" title="Radera">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Radera tjänst?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tjänsten kommer att inaktiveras. Befintliga bokningar påverkas inte.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Avbryt</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(tjanst.id)}>
                                Radera
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {tjanst.beskrivning}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{tjanst.varaktighet} min</span>
                      <span className="font-semibold text-foreground">
                        {(tjanst.pris / 100).toFixed(0)} kr
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <TjanstFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTjanst(undefined);
        }}
        onSubmit={editingTjanst ? handleUpdate : handleCreate}
        tjanst={editingTjanst}
        isLoading={isLoading}
      />
    </div>
  );
}
