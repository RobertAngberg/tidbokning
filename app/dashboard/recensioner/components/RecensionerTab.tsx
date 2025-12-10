"use client";

import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../_components/Card";

interface RecensionerTabProps {
  recensioner: Array<{
    id: string;
    betyg: number;
    kommentar: string | null;
    skapadDatum: Date;
    kund: {
      namn: string;
    } | null;
  }>;
  snittbetyg: number | null;
}

export function RecensionerTab({ recensioner, snittbetyg }: RecensionerTabProps) {
  return (
    <div className="space-y-6">
      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-600">Snittbetyg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {snittbetyg !== null ? (
                <>
                  <div className="text-4xl font-bold text-amber-600">{snittbetyg.toFixed(1)}</div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(snittbetyg)
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-2xl text-stone-400">Inga recensioner</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-600">Antal recensioner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-stone-900">{recensioner.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-600">5-stjärniga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {recensioner.filter((r) => r.betyg === 5).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista över recensioner */}
      <Card>
        <CardHeader>
          <CardTitle>Alla recensioner</CardTitle>
        </CardHeader>
        <CardContent>
          {recensioner.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <p>Inga recensioner ännu.</p>
              <p className="text-sm mt-2">Recensioner visas här när kunder lämnar feedback.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recensioner.map((recension) => (
                <div
                  key={recension.id}
                  className="p-4 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-stone-900">
                        {recension.kund?.namn || "Anonym"}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < recension.betyg
                                ? "fill-amber-400 text-amber-400"
                                : "text-stone-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-stone-500">
                      {new Date(recension.skapadDatum).toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  {recension.kommentar && (
                    <p className="text-stone-700 leading-relaxed">{recension.kommentar}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
