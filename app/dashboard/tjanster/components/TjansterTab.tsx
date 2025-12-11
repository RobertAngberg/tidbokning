"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../../_components/Card";
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
import { KategoriFormModal } from "./KategoriFormModal";
import {
  skapaTjanstAction,
  uppdateraTjanstAction,
  raderaTjanstAction,
  uppdateraTjanstOrdning,
} from "../actions/tjanster";
import {
  skapaKategori,
  uppdateraKategori,
  raderaKategori,
  uppdateraKategoriOrdning,
} from "../actions/kategorier";
import type { TjanstMedKategori } from "../../../_server/db/schema/tjanster";
import type { Kategori } from "../../../_server/db/schema/kategorier";
import { Pencil, Trash2, GripVertical, Plus } from "lucide-react";

interface TjansterTabProps {
  tjanster: TjanstMedKategori[];
  kategorier: Kategori[];
  foretagsslug: string;
}

export function TjansterTab({
  tjanster: initialTjanster,
  kategorier: initialKategorier,
  foretagsslug,
}: TjansterTabProps) {
  const router = useRouter();
  const [isTjanstModalOpen, setIsTjanstModalOpen] = useState(false);
  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
  const [editingTjanst, setEditingTjanst] = useState<TjanstMedKategori | undefined>();
  const [editingKategori, setEditingKategori] = useState<Kategori | undefined>();

  // Kategori drag-and-drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [lokalKategorier, setLokalKategorier] = useState(initialKategorier);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Tjänst drag-and-drop state
  const [lokalTjanster, setLokalTjanster] = useState(initialTjanster);
  const [draggedTjanstId, setDraggedTjanstId] = useState<string | null>(null);
  const [draggedTjanstKategori, setDraggedTjanstKategori] = useState<string | null>(null);
  const [hasUnsavedTjanstChanges, setHasUnsavedTjanstChanges] = useState(false);

  // Uppdatera lokal state när props ändras - men inte om vi har osparade ändringar
  if (initialKategorier !== lokalKategorier && draggedIndex === null && !hasUnsavedChanges) {
    setLokalKategorier(initialKategorier);
  }
  if (initialTjanster !== lokalTjanster && draggedTjanstId === null && !hasUnsavedTjanstChanges) {
    setLokalTjanster(initialTjanster);
  }

  // Gruppera tjänster per kategori
  const getTjansterForKategori = (kategoriNamn: string) => {
    return lokalTjanster.filter((t) => t.kategori === kategoriNamn);
  };

  // Tjänster utan kategori
  const okategoriseradeTjanster = lokalTjanster.filter((t) => !t.kategori || t.kategori === "");

  const openCreateTjanstModal = () => {
    setEditingTjanst(undefined);
    setIsTjanstModalOpen(true);
  };

  const openEditTjanstModal = (tjanst: TjanstMedKategori) => {
    setEditingTjanst(tjanst);
    setIsTjanstModalOpen(true);
  };

  const closeTjanstModal = () => {
    setIsTjanstModalOpen(false);
    setEditingTjanst(undefined);
    router.refresh();
  };

  const openCreateKategoriModal = () => {
    setEditingKategori(undefined);
    setIsKategoriModalOpen(true);
  };

  const openEditKategoriModal = (kategori: Kategori) => {
    setEditingKategori(kategori);
    setIsKategoriModalOpen(true);
  };

  const closeKategoriModal = () => {
    setIsKategoriModalOpen(false);
    setEditingKategori(undefined);
    router.refresh();
  };

  const handleDeleteTjanst = async (id: string) => {
    await raderaTjanstAction(id);
    router.refresh();
  };

  const handleDeleteKategori = async (id: string) => {
    await raderaKategori(id);
    router.refresh();
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && index !== draggedIndex && dragOverIndex !== index) {
      const newKategorier = [...lokalKategorier];
      const draggedItem = newKategorier[draggedIndex];
      newKategorier.splice(draggedIndex, 1);
      newKategorier.splice(index, 0, draggedItem);

      setLokalKategorier(newKategorier);
      setDraggedIndex(index);
      setDragOverIndex(index);
      setHasUnsavedChanges(true);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();

    if (draggedIndex === null) {
      handleDragEnd();
      return;
    }

    const ordningar = lokalKategorier.map((kat, index) => ({
      id: kat.id,
      ordning: index,
    }));

    handleDragEnd();
    await uppdateraKategoriOrdning(ordningar);
    setTimeout(() => setHasUnsavedChanges(false), 500);
  };

  // Tjänst drag-and-drop handlers
  const handleTjanstDragStart = (
    e: React.DragEvent,
    tjanstId: string,
    kategoriNamn: string | null
  ) => {
    e.stopPropagation();
    setDraggedTjanstId(tjanstId);
    setDraggedTjanstKategori(kategoriNamn);
  };

  const handleTjanstDragOver = (
    e: React.DragEvent,
    targetId: string,
    kategoriNamn: string | null
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTjanstId || draggedTjanstId === targetId) return;
    if (draggedTjanstKategori !== kategoriNamn) return; // Bara inom samma kategori

    const tjansterIKategori = lokalTjanster.filter((t) =>
      kategoriNamn ? t.kategori === kategoriNamn : !t.kategori || t.kategori === ""
    );

    const draggedIdx = tjansterIKategori.findIndex((t) => t.id === draggedTjanstId);
    const targetIdx = tjansterIKategori.findIndex((t) => t.id === targetId);

    if (draggedIdx === -1 || targetIdx === -1 || draggedIdx === targetIdx) return;

    // Skapa ny array med omordnade tjänster
    const newTjanster = [...lokalTjanster];
    const allDraggedIdx = newTjanster.findIndex((t) => t.id === draggedTjanstId);
    const allTargetIdx = newTjanster.findIndex((t) => t.id === targetId);

    const [draggedItem] = newTjanster.splice(allDraggedIdx, 1);
    newTjanster.splice(allTargetIdx, 0, draggedItem);

    setLokalTjanster(newTjanster);
    setHasUnsavedTjanstChanges(true);
  };

  const handleTjanstDragEnd = () => {
    setDraggedTjanstId(null);
    setDraggedTjanstKategori(null);
  };

  const handleTjanstDrop = async (e: React.DragEvent, kategoriNamn: string | null) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTjanstId) {
      handleTjanstDragEnd();
      return;
    }

    // Hämta tjänster i denna kategori och sätt ordning
    const tjansterIKategori = lokalTjanster.filter((t) =>
      kategoriNamn ? t.kategori === kategoriNamn : !t.kategori || t.kategori === ""
    );

    const ordningar = tjansterIKategori.map((t, index) => ({
      id: t.id,
      ordning: index,
    }));

    handleTjanstDragEnd();
    await uppdateraTjanstOrdning(ordningar);
    setTimeout(() => setHasUnsavedTjanstChanges(false), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap items-center">
        <button
          onClick={openCreateKategoriModal}
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 font-medium"
        >
          + Ny kategori
        </button>
        <button
          onClick={openCreateTjanstModal}
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 font-medium"
        >
          + Ny tjänst
        </button>
      </div>

      {lokalKategorier.length === 0 && okategoriseradeTjanster.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">
            Inga kategorier eller tjänster ännu. Börja med att skapa en kategori.
          </p>
        </Card>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {lokalKategorier.map((kategori, index) => {
            const tjansterIKategori = getTjansterForKategori(kategori.namn);
            return (
              <div key={kategori.id} className="relative transition-transform duration-200">
                <Card
                  className={`overflow-hidden transition-all duration-200 cursor-move ${
                    draggedIndex === index
                      ? "opacity-30 scale-95 bg-teal-50 border-2 border-dashed border-teal-400"
                      : draggedIndex !== null
                      ? "border-2 border-stone-200"
                      : "hover:border-stone-300"
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                >
                  {/* Kategori header */}
                  <div className="bg-stone-50 border-b p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-stone-400 cursor-move" />
                      <h3 className="text-lg font-semibold text-foreground">{kategori.namn}</h3>
                      <span className="text-sm text-muted-foreground">
                        ({tjansterIKategori.length}{" "}
                        {tjansterIKategori.length === 1 ? "tjänst" : "tjänster"})
                      </span>
                      {kategori.aktiv === 0 && (
                        <span className="text-xs text-muted-foreground">(Inaktiv)</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditKategoriModal(kategori)}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition-colors"
                        title="Redigera kategori"
                      >
                        <Pencil className="w-4 h-4 text-stone-600" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                            title="Radera kategori"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Detta kommer att radera kategorin &quot;{kategori.namn}&quot;.
                              Tjänster i denna kategori kommer att bli okategoriserade.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteKategori(kategori.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Radera
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Tjänster i kategorin */}
                  <div
                    className="p-4"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleTjanstDrop(e, kategori.namn)}
                  >
                    {tjansterIKategori.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        Inga tjänster i denna kategori än
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {tjansterIKategori.map((tjanst) => (
                          <div
                            key={tjanst.id}
                            draggable
                            onDragStart={(e) => handleTjanstDragStart(e, tjanst.id, kategori.namn)}
                            onDragOver={(e) => handleTjanstDragOver(e, tjanst.id, kategori.namn)}
                            onDragEnd={handleTjanstDragEnd}
                            className={`flex items-center justify-between p-3 bg-stone-50 rounded-md transition-all cursor-move ${
                              draggedTjanstId === tjanst.id
                                ? "opacity-30 scale-95 bg-teal-50 border-2 border-dashed border-teal-400"
                                : "hover:bg-stone-100"
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <GripVertical className="w-4 h-4 text-stone-400 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-foreground">
                                    {tjanst.namn}
                                  </span>
                                  {tjanst.aktiv === 0 && (
                                    <span className="inline-block px-2 py-0.5 bg-gray-500/20 text-gray-600 text-xs rounded-full">
                                      Inaktiv
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
                                  <span className="min-w-[60px]">{tjanst.varaktighet} min</span>
                                  <span className="text-foreground min-w-[70px]">
                                    {(tjanst.pris / 100).toFixed(0)} kr
                                  </span>
                                  {tjanst.beskrivning && (
                                    <span className="line-clamp-1">{tjanst.beskrivning}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => openEditTjanstModal(tjanst)}
                                className="p-1.5 hover:bg-stone-200 rounded-md transition-colors"
                                title="Redigera tjänst"
                              >
                                <Pencil className="w-4 h-4 text-stone-600" />
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    className="p-1.5 hover:bg-red-100 rounded-md transition-colors"
                                    title="Radera tjänst"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Detta kommer att permanent radera tjänsten &quot;{tjanst.namn}
                                      &quot;.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteTjanst(tjanst.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
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
                  </div>
                </Card>
              </div>
            );
          })}

          {/* Okategoriserade tjänster */}
          {okategoriseradeTjanster.length > 0 && (
            <Card className="overflow-hidden">
              <div className="bg-stone-50 border-b p-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Okategoriserade tjänster ({okategoriseradeTjanster.length})
                </h3>
              </div>
              <div
                className="p-4 space-y-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleTjanstDrop(e, null)}
              >
                {okategoriseradeTjanster.map((tjanst) => (
                  <div
                    key={tjanst.id}
                    draggable
                    onDragStart={(e) => handleTjanstDragStart(e, tjanst.id, null)}
                    onDragOver={(e) => handleTjanstDragOver(e, tjanst.id, null)}
                    onDragEnd={handleTjanstDragEnd}
                    className={`flex items-center justify-between p-3 bg-stone-50 rounded-md transition-all cursor-move ${
                      draggedTjanstId === tjanst.id
                        ? "opacity-30 scale-95 bg-teal-50 border-2 border-dashed border-teal-400"
                        : "hover:bg-stone-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <GripVertical className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">{tjanst.namn}</span>
                          {tjanst.aktiv === 0 && (
                            <span className="inline-block px-2 py-0.5 bg-gray-500/20 text-gray-600 text-xs rounded-full">
                              Inaktiv
                            </span>
                          )}
                        </div>
                        <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
                          <span className="min-w-[60px]">{tjanst.varaktighet} min</span>
                          <span className="text-foreground min-w-[70px]">
                            {(tjanst.pris / 100).toFixed(0)} kr
                          </span>
                          {tjanst.beskrivning && (
                            <span className="line-clamp-1">{tjanst.beskrivning}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditTjanstModal(tjanst)}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition-colors"
                        title="Redigera tjänst"
                      >
                        <Pencil className="w-4 h-4 text-stone-600" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-1.5 hover:bg-red-100 rounded-md transition-colors"
                            title="Radera tjänst"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Detta kommer att permanent radera tjänsten &quot;{tjanst.namn}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTjanst(tjanst.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Radera
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      <TjanstFormModal
        isOpen={isTjanstModalOpen}
        onClose={closeTjanstModal}
        action={editingTjanst ? uppdateraTjanstAction : skapaTjanstAction}
        tjanst={editingTjanst}
        existingKategorier={lokalKategorier.map((k) => k.namn)}
      />

      <KategoriFormModal
        isOpen={isKategoriModalOpen}
        onClose={closeKategoriModal}
        kategori={editingKategori}
        foretagsslug={foretagsslug}
        action={editingKategori ? uppdateraKategori : skapaKategori}
      />
    </div>
  );
}
