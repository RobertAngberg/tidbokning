"use client";

import type { Tjanst } from "../../_server/db/schema/tjanster";

export function useBoka(tjänster: Tjanst[]) {
  // Gruppera tjänster per kategori
  const groupedServices = tjänster.reduce((acc, tjänst) => {
    const kategori = tjänst.kategori || "Övrigt";
    if (!acc[kategori]) {
      acc[kategori] = [];
    }
    acc[kategori].push(tjänst);
    return acc;
  }, {} as Record<string, Tjanst[]>);

  // Sortera kategorier i önskad ordning
  const categoryOrder = [
    "Duomassage",
    "Oljemassage",
    "Thaimassage",
    "Rygg & Nackmassage",
    "Fotbehandling",
    "Specialmassage",
    "Klippkort & Paket",
    "Spa & Relax",
    "Erbjudanden",
    "Övrigt",
  ];

  const sortedCategories = Object.keys(groupedServices).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  // Category images mapping - olika bilder för varje kategori
  const categoryImages: Record<string, string> = {
    Duomassage: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop",
    Oljemassage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
    Thaimassage:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=400&fit=crop",
    "Rygg & Nackmassage":
      "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&h=400&fit=crop",
    Fotbehandling:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop",
    Specialmassage:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop",
    "Klippkort & Paket":
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    "Spa & Relax":
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop",
    Erbjudanden:
      "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&h=400&fit=crop",
    Övrigt: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=600&h=400&fit=crop",
  };

  const getImageForService = (tjänst: Tjanst) => {
    const kategori = tjänst.kategori || "Övrigt";
    return categoryImages[kategori] || categoryImages.Övrigt;
  };

  return {
    groupedServices,
    sortedCategories,
    getImageForService,
  };
}
