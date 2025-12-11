import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { raderaUtforare } from "../actions/utforare";
import { hamtaUtforareTillganglighet } from "../actions/tillganglighet";
import type { Utforare } from "../../../_server/db/schema/utforare";
import type { UtforareTillganglighet } from "../../../_server/db/schema/tillganglighet";

export function useUtforare(initialUtforare: Utforare[]) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUtforare, setEditingUtforare] = useState<Utforare | undefined>();
  const [editingTillganglighet, setEditingTillganglighet] = useState<
    UtforareTillganglighet[] | undefined
  >();
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
    setEditingTillganglighet(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = async (person: Utforare) => {
    setEditingUtforare(person);

    // Hämta tillgänglighet för utföraren
    const tillganglighet = await hamtaUtforareTillganglighet(person.id);
    setEditingTillganglighet(tillganglighet);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUtforare(undefined);
    setEditingTillganglighet(undefined);
  };

  return {
    // State
    isModalOpen,
    editingUtforare,
    editingTillganglighet,
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
