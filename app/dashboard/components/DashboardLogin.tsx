"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loggaInAction } from "../actions/auth";

export function DashboardLogin() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loggaInAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Dashboard</h1>
          <p className="text-stone-600">Logga in för att fortsätta</p>
        </div>

        <form action={formAction} className="space-y-6">
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
              placeholder="admin@foretag.se"
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
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="••••••••"
            />
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
            {isPending ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-600">
          <p>
            Har du inget konto?{" "}
            <a href="/registrera" className="text-amber-600 hover:text-amber-700 font-medium">
              Registrera dig här
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
