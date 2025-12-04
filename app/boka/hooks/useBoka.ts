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

  // Service images mapping
  const serviceImages = {
    massage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
    konsultation:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
    träning: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
    klippning: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&h=400&fit=crop",
    frisör: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
    default: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=600&h=400&fit=crop",
  };

  const getImageForService = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("massage")) return serviceImages.massage;
    if (lowerName.includes("konsultation")) return serviceImages.konsultation;
    if (lowerName.includes("träning") || lowerName.includes("pt")) return serviceImages.träning;
    if (lowerName.includes("klippning") || lowerName.includes("hår"))
      return serviceImages.klippning;
    if (lowerName.includes("frisör")) return serviceImages.frisör;
    return serviceImages.default;
  };

  return {
    groupedServices,
    sortedCategories,
    getImageForService,
  };
}
