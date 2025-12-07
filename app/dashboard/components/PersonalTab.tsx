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
import { PersonalFormModal } from "./PersonalFormModal";
import { useSkapaPersonal, useUppdateraPersonal, useRaderaPersonal } from "../hooks/usePersonal";
import type { Personal } from "../../_server/db/schema/personal";
import { Pencil, Trash2, Mail, Phone } from "lucide-react";

interface PersonalFormData {
  namn: string;
  email: string;
  telefon: string;
  bio: string;
  profilbildUrl: string;
  aktiv: boolean;
}

interface PersonalTabProps {
  personal: Personal[];
}

export function PersonalTab({ personal }: PersonalTabProps) {
  const skapaPersonal = useSkapaPersonal();
  const uppdateraPersonal = useUppdateraPersonal();
  const raderaPersonal = useRaderaPersonal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState<Personal | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [visaInaktiva, setVisaInaktiva] = useState(false);

  const filteredPersonal = personal.filter((person) => {
    const matchesSearch =
      person.namn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAktiv = visaInaktiva || person.aktiv === 1;
    return matchesSearch && matchesAktiv;
  });

  const handleCreate = async (data: PersonalFormData) => {
    skapaPersonal.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = async (data: PersonalFormData) => {
    if (!editingPersonal) return;
    uppdateraPersonal.mutate(
      { id: editingPersonal.id, data },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingPersonal(undefined);
        },
      }
    );
  };

  const openCreateModal = () => {
    setEditingPersonal(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (person: Personal) => {
    setEditingPersonal(person);
    setIsModalOpen(true);
  };

  const isLoading = skapaPersonal.isPending || uppdateraPersonal.isPending;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap items-center">
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 font-medium"
        >
          + Lägg till medarbetare
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

      {filteredPersonal.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">Inga medarbetare hittades</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPersonal.map((person) => (
            <Card key={person.id} className="p-4 relative">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{person.namn}</h4>
                  {person.aktiv === 0 && (
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
                        <AlertDialogTitle>Radera medarbetare?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Medarbetaren kommer att inaktiveras. Befintliga bokningar påverkas inte.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Avbryt</AlertDialogCancel>
                        <AlertDialogAction onClick={() => raderaPersonal.mutate(person.id)}>
                          Radera
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{person.email}</span>
                </div>
                {person.telefon && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{person.telefon}</span>
                  </div>
                )}
                {person.bio && (
                  <p className="text-muted-foreground line-clamp-2 mt-2">{person.bio}</p>
                )}
              </div>

              {person.profilbildUrl && (
                <div className="mt-3">
                  <img
                    src={person.profilbildUrl}
                    alt={person.namn}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <PersonalFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPersonal(undefined);
        }}
        onSubmit={editingPersonal ? handleUpdate : handleCreate}
        personal={editingPersonal}
        isLoading={isLoading}
      />
    </div>
  );
}
