"use client";

import { Label } from "../../../_components/Label";
import { Input } from "../../../_components/Input";
import type { Oppettid } from "../../../_server/db/schema/oppettider";

interface OppettiderDagRadProps {
  dag: string;
  oppettid?: Oppettid;
  onChange: (
    dag: string,
    oppnar: string,
    stanger: string,
    stangt: boolean,
    lunchStart: string | null,
    lunchSlut: string | null
  ) => void;
}

export function OppettiderDagRad({ dag, oppettid, onChange }: OppettiderDagRadProps) {
  // Default till öppet 08:00-17:00 för vardagar
  const arVardag = !["lördag", "söndag"].includes(dag);
  const oppnar = oppettid?.oppnar || "08:00";
  const stanger = oppettid?.stanger || "17:00";
  const stangt = oppettid?.stangt ?? !arVardag; // Stängt på helger som default
  const lunchStart = oppettid?.lunchStart || (arVardag ? "12:00" : null);
  const lunchSlut = oppettid?.lunchSlut || (arVardag ? "13:00" : null);

  const handleStangtChange = (checked: boolean) => {
    onChange(
      dag,
      oppnar,
      stanger,
      checked,
      checked ? null : lunchStart,
      checked ? null : lunchSlut
    );
  };

  const handleOppnarChange = (value: string) => {
    onChange(dag, value, stanger, stangt, lunchStart, lunchSlut);
  };

  const handleStangerChange = (value: string) => {
    onChange(dag, oppnar, value, stangt, lunchStart, lunchSlut);
  };

  const handleLunchStartChange = (value: string) => {
    onChange(dag, oppnar, stanger, stangt, value || null, lunchSlut);
  };

  const handleLunchSlutChange = (value: string) => {
    onChange(dag, oppnar, stanger, stangt, lunchStart, value || null);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg flex-wrap">
      <div className="w-20 font-semibold capitalize text-stone-700 shrink-0">{dag}</div>

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
          <div className="flex items-center gap-1 border-l border-stone-300 pl-4">
            <Label className="text-sm text-stone-600 mr-1">Öppnar:</Label>
            <Input
              type="time"
              value={oppnar}
              onChange={(e) => handleOppnarChange(e.target.value)}
              className="w-28"
            />
          </div>

          <div className="flex items-center gap-1">
            <Label className="text-sm text-stone-600 mr-1">Stänger:</Label>
            <Input
              type="time"
              value={stanger}
              onChange={(e) => handleStangerChange(e.target.value)}
              className="w-28"
            />
          </div>

          <div className="flex items-center gap-1 border-l border-stone-300 pl-4">
            <Label className="text-sm text-stone-600 mr-1">Lunch:</Label>
            <Input
              type="time"
              value={lunchStart || ""}
              onChange={(e) => handleLunchStartChange(e.target.value)}
              className="w-28"
              placeholder="Från"
            />
            <span className="text-stone-400">–</span>
            <Input
              type="time"
              value={lunchSlut || ""}
              onChange={(e) => handleLunchSlutChange(e.target.value)}
              className="w-28"
              placeholder="Till"
            />
            {lunchStart && lunchSlut && (
              <button
                type="button"
                onClick={() => {
                  onChange(dag, oppnar, stanger, stangt, null, null);
                }}
                className="text-sm font-bold text-stone-500 hover:text-red-500 transition-colors ml-3"
              >
                ✕
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
