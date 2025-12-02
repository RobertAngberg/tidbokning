"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../_components/Card";
import { Button } from "../../_components/Button";
import { Input } from "../../_components/Input";
import { Label } from "../../_components/Label";
import { useSkapaTjanst } from "../hooks/useTjanster";

export function SkapaTjänstFormulär() {
  const [message, setMessage] = useState("");
  const skapaTjanst = useSkapaTjanst((result) => {
    if (result.success) {
      setMessage("✅ Tjänst skapad!");
    } else {
      setMessage(`❌ ${result.error}`);
    }
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const formData = new FormData(e.currentTarget);

    skapaTjanst.mutate(
      {
        namn: formData.get("namn") as string,
        beskrivning: formData.get("beskrivning") as string,
        varaktighet: Number(formData.get("varaktighet")),
        pris: Number(formData.get("pris")),
        foretagsslug: "demo",
      },
      {
        onSuccess: () => {
          (e.target as HTMLFormElement).reset();
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skapa ny tjänst</CardTitle>
        <CardDescription>Lägg till en ny tjänst till ditt företag</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="namn">Namn på tjänst</Label>
            <Input id="namn" name="namn" required />
          </div>

          <div>
            <Label htmlFor="beskrivning">Beskrivning</Label>
            <Input id="beskrivning" name="beskrivning" />
          </div>

          <div>
            <Label htmlFor="varaktighet">Varaktighet (minuter)</Label>
            <Input id="varaktighet" name="varaktighet" type="number" min="15" required />
          </div>

          <div>
            <Label htmlFor="pris">Pris (kr)</Label>
            <Input id="pris" name="pris" type="number" min="0" step="0.01" required />
          </div>

          <Button type="submit" disabled={skapaTjanst.isPending} className="w-full">
            {skapaTjanst.isPending ? "Skapar..." : "Skapa tjänst"}
          </Button>

          {message && (
            <p className={message.includes("✅") ? "text-green-600" : "text-red-600"}>{message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
