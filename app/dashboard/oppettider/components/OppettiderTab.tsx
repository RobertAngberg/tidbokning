"use client";

import { Card } from "../../../_components/Card";
import { Button } from "../../../_components/Button";
import { useOppettider } from "../hooks/useOppettider";
import { OppettiderDagRad } from "./OppettiderDagRad";

const VECKODAGAR = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];

export function OppettiderTab() {
  const { sparar, harAndrats, hämtaÖppettidForDag, handleChange, handleSparaAlla } =
    useOppettider();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          {VECKODAGAR.map((dag) => {
            const oppettid = hämtaÖppettidForDag(dag);
            return (
              <OppettiderDagRad key={dag} dag={dag} oppettid={oppettid} onChange={handleChange} />
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-stone-200 flex justify-end">
          <Button onClick={handleSparaAlla} disabled={!harAndrats || sparar} size="lg">
            {sparar ? "Sparar..." : "Spara alla ändringar"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
