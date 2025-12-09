"use client";

import { useState } from "react";
import { Label } from "../../../_components/Label";
import { Input } from "../../../_components/Input";
import { Button } from "../../../_components/Button";
import type { Oppettid } from "../../../_server/db/schema/oppettider";

interface OppettiderDagRadProps {
  dag: string;
  oppettid?: Oppettid;
  onSpara: (dag: string, oppnar: string, stanger: string, stangt: boolean) => Promise<void>;
  sparar: boolean;
}

export function OppettiderDagRad({ dag, oppettid, onSpara, sparar }: OppettiderDagRadProps) {
  const [oppnar, setOppnar] = useState(oppettid?.oppnar || "09:00");
  const [stanger, setStanger] = useState(oppettid?.stanger || "17:00");
  const [stangt, setStangt] = useState(oppettid?.stangt || false);
  const [harAndrats, setHarAndrats] = useState(false);

  const handleChange = () => {
    setHarAndrats(true);
  };

  const handleSpara = async () => {
    await onSpara(dag, oppnar, stanger, stangt);
    setHarAndrats(false);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
      <div className="w-24 font-semibold capitalize text-stone-700">{dag}</div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={stangt}
          onChange={(e) => {
            setStangt(e.target.checked);
            handleChange();
          }}
          className="w-4 h-4 rounded border-stone-300"
        />
        <Label className="text-sm">Stängt</Label>
      </div>

      {!stangt && (
        <>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-stone-600">Öppnar:</Label>
            <Input
              type="time"
              value={oppnar}
              onChange={(e) => {
                setOppnar(e.target.value);
                handleChange();
              }}
              className="w-32"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-stone-600">Stänger:</Label>
            <Input
              type="time"
              value={stanger}
              onChange={(e) => {
                setStanger(e.target.value);
                handleChange();
              }}
              className="w-32"
            />
          </div>
        </>
      )}

      <Button
        onClick={handleSpara}
        disabled={!harAndrats || sparar}
        variant={harAndrats ? "default" : "outline"}
        size="sm"
        className="ml-auto"
      >
        {sparar ? "Sparar..." : "Spara"}
      </Button>
    </div>
  );
}
