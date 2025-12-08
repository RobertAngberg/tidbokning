"use server";

import { authClient } from "../../_lib/auth-client";

export async function loggaInAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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
