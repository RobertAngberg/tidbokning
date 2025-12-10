import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../_lib/auth-client";

export function useRegistrering() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Skapa användaren
      const signUpResult = await authClient.signUp.email({
        email,
        password,
        name: "Admin",
      });

      if (signUpResult.error) {
        let felmeddelande = "Kunde inte skapa konto";

        if (
          signUpResult.error.message?.includes("already exists") ||
          signUpResult.error.message?.includes("User already exists")
        ) {
          felmeddelande = "En användare med denna e-postadress finns redan.";
        }

        setError(felmeddelande);
        setIsPending(false);
        return;
      }

      // Sign up med Better Auth skapar INTE automatisk session, logga in
      const signInResult = await authClient.signIn.email({
        email,
        password,
      });

      if (signInResult.error) {
        setError("Konto skapat men kunde inte logga in. Försök logga in manuellt.");
        setIsPending(false);
        return;
      }

      // Nu har vi en session, gå till onboarding
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      console.error("Registreringsfel:", err);
      setError("Ett oväntat fel inträffade.");
      setIsPending(false);
    }
  };

  return {
    error,
    isPending,
    handleSubmit,
  };
}
