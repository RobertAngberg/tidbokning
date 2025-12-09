"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { skapaFöretagOchAdminAction } from "./actions";

type ActionState = { success: boolean; error?: string } | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    skapaFöretagOchAdminAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Välkommen! 🎉</h1>
          <p className="text-stone-600">Skapa ditt företag för att komma igång med bokningar</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Företagsinformation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="foretagsnamn"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Företagsnamn *
                </label>
                <input
                  id="foretagsnamn"
                  name="foretagsnamn"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Mitt Företag AB"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="adress" className="block text-sm font-medium text-stone-700 mb-2">
                  Adress
                </label>
                <input
                  id="adress"
                  name="adress"
                  type="text"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Storgatan 1"
                />
              </div>

              <div>
                <label
                  htmlFor="postnummer"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Postnummer
                </label>
                <input
                  id="postnummer"
                  name="postnummer"
                  type="text"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="123 45"
                />
              </div>

              <div>
                <label htmlFor="stad" className="block text-sm font-medium text-stone-700 mb-2">
                  Stad
                </label>
                <input
                  id="stad"
                  name="stad"
                  type="text"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Stockholm"
                />
              </div>

              <div>
                <label htmlFor="telefon" className="block text-sm font-medium text-stone-700 mb-2">
                  Telefon
                </label>
                <input
                  id="telefon"
                  name="telefon"
                  type="tel"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="08-123 45 67"
                />
              </div>

              <div>
                <label
                  htmlFor="webbplats"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Hemsida (valfri)
                </label>
                <input
                  id="webbplats"
                  name="webbplats"
                  type="url"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://mittforetag.se"
                />
              </div>
            </div>
          </div>

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Skapar företag..." : "Skapa företag och kom igång"}
          </button>
        </form>
      </div>
    </div>
  );
}
