"use client";

import { useState } from "react";
import { Card } from "../../_components/Card";
import { Input } from "../../_components/Input";
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
import { UtforareFormModal } from "./UtforareFormModal";
import { useSkapaUtförare, useUppdateraUtförare, useRaderaUtförare } from "../hooks/useUtforare";
import type { Utforare } from "../../_server/db/schema/utforare";
import { Pencil, Trash2, Mail, Phone } from "lucide-react";

interface UtforareFormData {
  namn: string;
  email: string;
  telefon: string;
  beskrivning: string;
  bildUrl: string;
  aktiv: boolean;
}

interface UtforareTabProps {
  utforare: Utforare[];
}

export function UtforareTab({ utforare }: UtforareTabProps) {
  const skapaUtforare = useSkapaUtförare();
  const uppdateraUtforare = useUppdateraUtförare();
  const raderaUtforare = useRaderaUtförare();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUtforare, setEditingUtforare] = useState<Utforare | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [visaInaktiva, setVisaInaktiva] = useState(false);

  const filteredUtforare = utforare.filter((person) => {
    const matchesSearch =
      person.namn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAktiv = visaInaktiva || person.aktiv;
    return matchesSearch && matchesAktiv;
  });

  const handleCreate = async (data: UtforareFormData) => {
    skapaUtforare.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = async (data: UtforareFormData) => {
    if (!editingUtforare) return;
    uppdateraUtforare.mutate(
      { id: editingUtforare.id, data },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingUtforare(undefined);
        },
      }
    );
  };

  const openCreateModal = () => {
    setEditingUtforare(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (person: Utforare) => {
    setEditingUtforare(person);
    setIsModalOpen(true);
  };

  const isLoading = skapaUtforare.isPending || uppdateraUtforare.isPending;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap items-center">
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 font-medium"
        >
          + Lägg till utförare
        </button>
        <Input
          placeholder="Sök på namn eller email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] max-w-[400px] bg-background"
        />
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

      {filteredUtforare.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">Inga utförare hittades</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUtforare.map((person) => (
            <Card key={person.id} className="p-4 relative">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{person.namn}</h4>
                  {!person.aktiv && (
                    <span className="text-xs text-muted-foreground">(Inaktiv)</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(person)}
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
                        <AlertDialogTitle>Radera utförare?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Utföraren kommer att inaktiveras. Befintliga bokningar påverkas inte.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Avbryt</AlertDialogCancel>
                        <AlertDialogAction onClick={() => raderaUtforare.mutate(person.id)}>
                          Radera
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {person.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{person.email}</span>
                  </div>
                )}
                {person.telefon && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{person.telefon}</span>
                  </div>
                )}
                {person.beskrivning && (
                  <p className="text-muted-foreground line-clamp-2 mt-2">{person.beskrivning}</p>
                )}
              </div>

              {person.bildUrl && (
                <div className="mt-3">
                  <img
                    src={person.bildUrl}
                    alt={person.namn}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <UtforareFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUtforare(undefined);
        }}
        onSubmit={editingUtforare ? handleUpdate : handleCreate}
        utforare={editingUtforare}
        isLoading={isLoading}
      />
    </div>
  );
}
