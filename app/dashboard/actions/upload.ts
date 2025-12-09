"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

/**
 * Ladda upp en fil till Vercel Blob Storage
 * @param formData FormData med filen under 'file' key
 * @returns URL till den uppladdade filen eller error
 */
export async function laddaUppFil(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "Ingen fil vald" };
    }

    // Validera filtyp (endast bilder)
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Endast bildfiler tillåtna" };
    }

    // Validera filstorlek (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: "Filen får max vara 5MB" };
    }

    // Ladda upp till Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true, // Lägger till random suffix för att undvika kollisioner
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Fel vid uppladdning:", error);
    return { success: false, error: "Kunde inte ladda upp filen" };
  }
}

/**
 * Radera en fil från Vercel Blob Storage
 * @param url URL till filen som ska raderas
 */
export async function raderaFil(url: string) {
  try {
    await del(url);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering:", error);
    return { success: false, error: "Kunde inte radera filen" };
  }
}
