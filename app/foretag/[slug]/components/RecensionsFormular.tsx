"use client";

import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../_components/Card";
import { Input } from "../../../_components/Input";
import { Label } from "../../../_components/Label";
import { Button } from "../../../_components/Button";
import { useRecensionsFormular } from "../hooks/useRecensionsFormular";

interface RecensionsFormularProps {
  foretagsslug: string;
}

export function RecensionsFormular({ foretagsslug }: RecensionsFormularProps) {
  const {
    isOpen,
    setIsOpen,
    kundEmail,
    setKundEmail,
    betyg,
    setBetyg,
    hoveredBetyg,
    setHoveredBetyg,
    kommentar,
    setKommentar,
    isSubmitting,
    message,
    handleSubmit,
    closeForm,
  } = useRecensionsFormular(foretagsslug);

  if (!isOpen) {
    return (
      <div className="text-center">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          Lämna en recension
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <CardTitle>Lämna en recension</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Din e-postadress *</Label>
            <Input
              id="email"
              type="email"
              value={kundEmail}
              onChange={(e) => setKundEmail(e.target.value)}
              placeholder="den du bokade med"
              required
              className="mt-1"
            />
            <p className="text-xs text-stone-500 mt-1">Samma e-post som du använde när du bokade</p>
          </div>

          <div>
            <Label>Betyg *</Label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setBetyg(star)}
                  onMouseEnter={() => setHoveredBetyg(star)}
                  onMouseLeave={() => setHoveredBetyg(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredBetyg || betyg)
                        ? "fill-amber-400 text-amber-400"
                        : "text-stone-300"
                    }`}
                  />
                </button>
              ))}
              {betyg > 0 && (
                <span className="ml-2 text-sm text-stone-600">{betyg} av 5 stjärnor</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="kommentar">Kommentar (valfritt)</Label>
            <textarea
              id="kommentar"
              value={kommentar}
              onChange={(e) => setKommentar(e.target.value)}
              placeholder="Berätta om din upplevelse..."
              rows={4}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || betyg === 0}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Skickar..." : "Skicka recension"}
            </Button>
            <Button
              type="button"
              onClick={closeForm}
              variant="outline"
              className="border-stone-300"
            >
              Avbryt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
