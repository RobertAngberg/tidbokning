"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../_lib/auth-client";

export default function RegisteraPage() {
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
        roll: "admin",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Skapa konto</h1>
          <p className="text-stone-600">Registrera dig för att komma igång</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="anna@exempel.se"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
              Lösenord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-stone-500 mt-1">Minst 8 tecken</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Skapar konto..." : "Skapa konto"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-600">
          <p>
            Har du redan ett konto?{" "}
            <a href="/dashboard" className="text-amber-600 hover:text-amber-700 font-medium">
              Logga in här
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
