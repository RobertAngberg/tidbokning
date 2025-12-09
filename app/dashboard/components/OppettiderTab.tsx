"use client";

import { Card } from "../../_components/Card";
import { useOppettider } from "../hooks/useOppettider";
import { OppettiderDagRad } from "./OppettiderDagRad";

const VECKODAGAR = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];

export function OppettiderTab() {
  const { sparar, hämtaÖppettidForDag, handleSparaÖppettid } = useOppettider();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          {VECKODAGAR.map((dag) => {
            const oppettid = hämtaÖppettidForDag(dag);
            return (
              <OppettiderDagRad
                key={dag}
                dag={dag}
                oppettid={oppettid}
                onSpara={handleSparaÖppettid}
                sparar={sparar}
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
}
