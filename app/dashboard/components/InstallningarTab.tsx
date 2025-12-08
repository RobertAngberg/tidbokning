"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../_components/Card";
import { Label } from "../../_components/Label";
import { Input } from "../../_components/Input";
import { Button } from "../../_components/Button";
import { uppdateraForetag, skapaForetag } from "../actions/foretag";
import type { Foretag } from "../../_server/db/schema/foretag";
import { authClient } from "../../_lib/auth-client";

interface InstallningarTabProps {
  foretag: Foretag | null;
}

const DAGAR = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];

export function InstallningarTab({ foretag }: InstallningarTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [formData, setFormData] = useState({
    namn: foretag?.namn || "",
    slug: foretag?.slug || "",
    beskrivning: foretag?.beskrivning || "",
    adress: foretag?.adress || "",
    postnummer: foretag?.postnummer || "",
    stad: foretag?.stad || "",
    telefon: foretag?.telefon || "",
    email: foretag?.email || "",
    webbplats: foretag?.webbplats || "",
    logoUrl: foretag?.logoUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      if (foretag) {
        const result = await uppdateraForetag(foretag.id, formData);
        if (result.success) {
          router.refresh();
        }
      } else {
        const result = await skapaForetag(formData);
        if (result.success) {
          router.refresh();
        }
      }
    });
  };

  const handleLoggaUt = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Fel vid utloggning:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Inställningar</h2>
        <Button
          onClick={handleLoggaUt}
          disabled={isLoggingOut}
          variant="outline"
          className="bg-red-600 hover:bg-red-700 text-white border-red-600"
        >
          {isLoggingOut ? "Loggar ut..." : "Logga ut"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Företagsinformation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="namn">Företagsnamn *</Label>
              <Input
                id="namn"
                value={formData.namn}
                onChange={(e) => setFormData({ ...formData, namn: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="ex: roberts-massage"
              />
            </div>
            <div>
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="adress">Adress</Label>
              <Input
                id="adress"
                value={formData.adress}
                onChange={(e) => setFormData({ ...formData, adress: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="postnummer">Postnummer</Label>
              <Input
                id="postnummer"
                value={formData.postnummer}
                onChange={(e) => setFormData({ ...formData, postnummer: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="stad">Stad</Label>
              <Input
                id="stad"
                value={formData.stad}
                onChange={(e) => setFormData({ ...formData, stad: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="telefon">Telefon</Label>
              <Input
                id="telefon"
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="webbplats">Webbplats</Label>
              <Input
                id="webbplats"
                type="url"
                value={formData.webbplats}
                onChange={(e) => setFormData({ ...formData, webbplats: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="beskrivning">Beskrivning</Label>
              <textarea
                id="beskrivning"
                value={formData.beskrivning}
                onChange={(e) => setFormData({ ...formData, beskrivning: e.target.value })}
                className="w-full px-3 py-2 rounded-md border bg-background text-foreground min-h-[100px]"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sparar..." : "Spara ändringar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
