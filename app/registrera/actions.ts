"use server";

import { auth } from "../_server/auth";
import { z } from "zod";
import { headers } from "next/headers";

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
    // Skapa användaren
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Admin",
        roll: "admin",
      },
      headers: await headers(),
    });

    console.log("=== SIGNUP SUCCESS DEBUG ===");
    console.log("User created successfully");

    // Logga in användaren direkt efter signup
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    // Verifiera att session skapades
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    console.log("Session after signin:", JSON.stringify(session, null, 2));
    console.log("============================");

    return { success: true };
  } catch (error: any) {
    console.error("Registreringsfel:", error);

    let felmeddelande = "Ett oväntat fel inträffade. Försök igen.";

    if (
      error?.message?.includes("already exists") ||
      error?.message?.includes("User already exists") ||
      error?.message?.includes("duplicate key")
    ) {
      felmeddelande =
        "En användare med denna e-postadress finns redan. Använd en annan e-postadress.";
    } else if (error?.message?.includes("Invalid email")) {
      felmeddelande = "Ogiltig e-postadress";
    } else if (error?.message?.includes("Password")) {
      felmeddelande = "Lösenordet uppfyller inte kraven";
    }

    return {
      success: false,
      error: felmeddelande,
    };
  }
}
