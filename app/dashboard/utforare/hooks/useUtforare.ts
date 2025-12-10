import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { raderaUtforare } from "../actions/utforare";
import type { Utforare } from "../../../_server/db/schema/utforare";

export function useUtforare(initialUtforare: Utforare[]) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUtforare, setEditingUtforare] = useState<Utforare | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [visaInaktiva, setVisaInaktiva] = useState(false);

  // Filtrera utförare
  const filteredUtforare = useMemo(() => {
    return initialUtforare.filter((person) => {
      const matchesSearch =
        person.namn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesAktiv = visaInaktiva || person.aktiv;
      return matchesSearch && matchesAktiv;
    });
  }, [initialUtforare, searchTerm, visaInaktiva]);

  // Hantera radering
  const handleDelete = async (id: string) => {
    startTransition(async () => {
      await raderaUtforare(id);
      router.refresh();
    });
  };

  // Modal-hantering
  const openCreateModal = () => {
    setEditingUtforare(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (person: Utforare) => {
    setEditingUtforare(person);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUtforare(undefined);
  };

  return {
    // State
    isModalOpen,
    editingUtforare,
    searchTerm,
    visaInaktiva,
    isPending,

    // Data
    filteredUtforare,

    // Actions
    setSearchTerm,
    setVisaInaktiva,
    handleDelete,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}
