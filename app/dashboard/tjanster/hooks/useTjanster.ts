import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { raderaTjänst } from "../actions/tjanster";
import type { TjanstMedKategori } from "../../../_server/db/schema/tjanster";

export function useTjanster(initialTjanster: TjanstMedKategori[]) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTjanst, setEditingTjanst] = useState<TjanstMedKategori | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState<string>("alla");
  const [visaInaktiva, setVisaInaktiva] = useState(false);

  // Hämta unika kategorier
  const kategorier = useMemo(() => {
    return Array.from(
      new Set(initialTjanster.map((t) => t.kategori).filter((k): k is string => k !== null))
    );
  }, [initialTjanster]);

  // Filtrera tjänster
  const filteredTjanster = useMemo(() => {
    return initialTjanster.filter((tjanst) => {
      const matchesSearch =
        tjanst.namn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tjanst.beskrivning?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesKategori = kategoriFilter === "alla" || tjanst.kategori === kategoriFilter;
      const matchesAktiv = visaInaktiva || tjanst.aktiv === 1;
      return matchesSearch && matchesKategori && matchesAktiv;
    });
  }, [initialTjanster, searchTerm, kategoriFilter, visaInaktiva]);

  // Gruppera tjänster per kategori
  const groupedTjanster = useMemo(() => {
    return filteredTjanster.reduce((acc, tjanst) => {
      const kategori = tjanst.kategori || "Övrigt";
      if (!acc[kategori]) acc[kategori] = [];
      acc[kategori].push(tjanst);
      return acc;
    }, {} as Record<string, TjanstMedKategori[]>);
  }, [filteredTjanster]);

  // Hantera radering
  const handleDelete = async (id: string) => {
    startTransition(async () => {
      await raderaTjänst(id);
      router.refresh();
    });
  };

  // Modal-hantering
  const openCreateModal = () => {
    setEditingTjanst(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (tjanst: TjanstMedKategori) => {
    setEditingTjanst(tjanst);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTjanst(undefined);
  };

  return {
    // State
    isModalOpen,
    editingTjanst,
    searchTerm,
    kategoriFilter,
    visaInaktiva,
    isPending,

    // Data
    kategorier,
    filteredTjanster,
    groupedTjanster,

    // Actions
    setSearchTerm,
    setKategoriFilter,
    setVisaInaktiva,
    handleDelete,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}
