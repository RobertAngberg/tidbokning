"use client";

import { Card } from "../../../_components/Card";
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
import { TjanstFormModal } from "./TjanstFormModal";
import { skapaTjänstAction, uppdateraTjänstAction } from "../actions/tjanster";
import { useTjanster } from "../hooks/useTjanster";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import { Pencil, Trash2 } from "lucide-react";

interface TjansterTabProps {
  tjanster: Tjanst[];
}

export function TjansterTab({ tjanster }: TjansterTabProps) {
  const {
    isModalOpen,
    editingTjanst,
    searchTerm,
    kategoriFilter,
    visaInaktiva,
    kategorier,
    groupedTjanster,
    setSearchTerm,
    setKategoriFilter,
    setVisaInaktiva,
    handleDelete,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useTjanster(tjanster);

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
          className="px-3 py-2 rounded-md border bg-background text-foreground w-[300px]"
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
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Namn</th>
                        <th className="text-left p-4 font-semibold">Beskrivning</th>
                        <th className="text-right p-4 font-semibold">Varaktighet</th>
                        <th className="text-right p-4 font-semibold">Pris</th>
                        <th className="text-center p-4 font-semibold">Status</th>
                        <th className="text-right p-4 font-semibold">Åtgärder</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tjansterIKategori.map((tjanst) => (
                        <tr key={tjanst.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="p-4">
                            <span className="font-medium">{tjanst.namn}</span>
                          </td>
                          <td className="p-4 max-w-md">
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {tjanst.beskrivning || "-"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-sm">{tjanst.varaktighet} min</span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-semibold">
                              {(tjanst.pris / 100).toFixed(0)} kr
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {tjanst.aktiv === 1 ? (
                              <span className="inline-block px-2 py-1 bg-green-500/20 text-green-600 text-xs rounded-full">
                                Aktiv
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 bg-gray-500/20 text-gray-600 text-xs rounded-full">
                                Inaktiv
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1 justify-end">
                              <button
                                onClick={() => openEditModal(tjanst)}
                                className="p-2 hover:bg-accent rounded"
                                title="Redigera"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="p-2 hover:bg-accent rounded" title="Radera">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Radera tjänst?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tjänsten kommer att inaktiveras. Befintliga bokningar påverkas
                                      inte.
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <TjanstFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        action={editingTjanst ? uppdateraTjänstAction : skapaTjänstAction}
        tjanst={editingTjanst}
        existingKategorier={kategorier}
      />
    </div>
  );
}
