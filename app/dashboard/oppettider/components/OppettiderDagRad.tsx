"use client";

import { Label } from "../../../_components/Label";
import { Input } from "../../../_components/Input";
import type { Oppettid } from "../../../_server/db/schema/oppettider";

interface OppettiderDagRadProps {
  dag: string;
  oppettid?: Oppettid;
  onChange: (dag: string, oppnar: string, stanger: string, stangt: boolean) => void;
}

export function OppettiderDagRad({ dag, oppettid, onChange }: OppettiderDagRadProps) {
  const oppnar = oppettid?.oppnar || "09:00";
  const stanger = oppettid?.stanger || "17:00";
  const stangt = oppettid?.stangt || false;

  const handleStangtChange = (checked: boolean) => {
    onChange(dag, oppnar, stanger, checked);
  };

  const handleOppnarChange = (value: string) => {
    onChange(dag, value, stanger, stangt);
  };

  const handleStangerChange = (value: string) => {
    onChange(dag, oppnar, value, stangt);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
      <div className="w-24 font-semibold capitalize text-stone-700">{dag}</div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={stangt}
          onChange={(e) => handleStangtChange(e.target.checked)}
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
              onChange={(e) => handleOppnarChange(e.target.value)}
              className="w-32"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-stone-600">Stänger:</Label>
            <Input
              type="time"
              value={stanger}
              onChange={(e) => handleStangerChange(e.target.value)}
              className="w-32"
            />
          </div>
        </>
      )}
    </div>
  );
}
