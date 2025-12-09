"use server";

import { authClient } from "../_lib/auth-client";
import { z } from "zod";

const registerFormDataSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken"),
});

export async function registreraAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = registerFormDataSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { email, password } = result.data;

  try {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: "Admin", // Tillfälligt namn
      roll: "admin", // Sätt som admin direkt
    });

    if (error) {
      // Översätt vanliga felmeddelanden till svenska
      let felmeddelande = "Kunde inte skapa konto";

      if (
        error.message?.includes("already exists") ||
        error.message?.includes("User already exists")
      ) {
        felmeddelande =
          "En användare med denna e-postadress finns redan. Använd en annan e-postadress.";
      } else if (error.message?.includes("Invalid email")) {
        felmeddelande = "Ogiltig e-postadress";
      } else if (error.message?.includes("Password")) {
        felmeddelande = "Lösenordet uppfyller inte kraven";
      }

      return {
        success: false,
        error: felmeddelande,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Registreringsfel:", error);
    return {
      success: false,
      error: "Ett oväntat fel inträffade. Försök igen.",
    };
  }
}
