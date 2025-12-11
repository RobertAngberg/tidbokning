"use client";

import { useEffect, useState } from "react";
import { Card } from "../../../_components/Card";
import { hamtaKunder, type KundMedStatistik } from "../actions/kunder";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export function KunderTab() {
  const [kunder, setKunder] = useState<KundMedStatistik[]>([]);
  const [loading, setLoading] = useState(true);
  const [sokText, setSokText] = useState("");

  useEffect(() => {
    const loadKunder = async () => {
      const data = await hamtaKunder();
      setKunder(data);
      setLoading(false);
    };
    void loadKunder();
  }, []);

  const filtreradeKunder = kunder.filter(
    (kund) =>
      kund.namn.toLowerCase().includes(sokText.toLowerCase()) ||
      kund.email.toLowerCase().includes(sokText.toLowerCase()) ||
      (kund.telefon && kund.telefon.includes(sokText))
  );

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center text-stone-500">Laddar kunder...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-stone-800">Kunder</h2>
            <p className="text-sm text-stone-500 mt-1">
              {kunder.length} {kunder.length === 1 ? "kund" : "kunder"} totalt
            </p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Sök kund..."
              value={sokText}
              onChange={(e) => setSokText(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {filtreradeKunder.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            {sokText
              ? "Inga kunder matchar sökningen"
              : "Inga kunder ännu. Kunder sparas automatiskt när de gör en bokning."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 font-semibold text-stone-600">Namn</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-600">E-post</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-600">Telefon</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-600">Bokningar</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-600">
                    Senaste bokning
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-600">Kund sedan</th>
                </tr>
              </thead>
              <tbody>
                {filtreradeKunder.map((kund) => (
                  <tr
                    key={kund.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-stone-800">{kund.namn}</span>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`mailto:${kund.email}`}
                        className="text-amber-600 hover:text-amber-700 hover:underline"
                      >
                        {kund.email}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {kund.telefon ? (
                        <a
                          href={`tel:${kund.telefon}`}
                          className="hover:text-amber-600 hover:underline"
                        >
                          {kund.telefon}
                        </a>
                      ) : (
                        <span className="text-stone-400">–</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {kund.antalBokningar} st
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {kund.senasteBokningDatum ? (
                        format(new Date(kund.senasteBokningDatum), "d MMM yyyy", { locale: sv })
                      ) : (
                        <span className="text-stone-400">–</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-sm">
                      {format(new Date(kund.skapadDatum), "d MMM yyyy", { locale: sv })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
