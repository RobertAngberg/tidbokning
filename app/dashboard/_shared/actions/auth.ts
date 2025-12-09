"use server";

import { auth } from "../../../_server/auth";
import { z } from "zod";
import { headers } from "next/headers";

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
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Ett oväntat fel uppstod. Försök igen.",
    };
  }
}
