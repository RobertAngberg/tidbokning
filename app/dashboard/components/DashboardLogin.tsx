"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../_lib/auth-client";

export function DashboardLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Fel email eller lösenord");
        setLoading(false);
        return;
      }

      if (data) {
        // Ladda om sidan för att visa dashboard
        router.refresh();
      }
    } catch (err) {
      setError("Ett oväntat fel uppstod. Försök igen.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Dashboard</h1>
          <p className="text-stone-600">Logga in för att fortsätta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loggar in..." : "Logga in"}
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
