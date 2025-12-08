"use server";

import { authClient } from "../../_lib/auth-client";
import { z } from "zod";

const loginFormDataSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(1, "Lösenord krävs"),
});

export async function loggaInAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginFormDataSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { email, password } = result.data;

  try {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Fel email eller lösenord",
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Ett oväntat fel uppstod. Försök igen.",
    };
  }
}
