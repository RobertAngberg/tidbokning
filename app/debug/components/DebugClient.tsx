"use client";

import { DebugTable } from "./DebugTable";
import {
  raderaTjänster,
  raderaBokningar,
  raderaAnvändare,
  raderaUtförare,
  raderaUtförareTjänster,
} from "../actions";
import type { Tjanst } from "../../_server/db/schema/tjanster";
import type { Bokning } from "../../_server/db/schema/bokningar";
import type { Anvandare } from "../../_server/db/schema/anvandare";
import type { Utforare } from "../../_server/db/schema/utforare";

interface UtforareTjanster {
  id: string;
  utforareId: string;
  tjanstId: string;
  skapadDatum: Date;
}

interface DebugClientProps {
  tjanster: Tjanst[];
  bokningar: Bokning[];
  anvandare: Anvandare[];
  utforare: Utforare[];
  utforareTjanster: UtforareTjanster[];
}

export function DebugClient({
  tjanster,
  bokningar,
  anvandare,
  utforare,
  utforareTjanster,
}: DebugClientProps) {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Database Debug</h1>
          <p className="text-slate-600">Översikt över allt innehåll i databasen</p>
        </div>

        <DebugTable
          title="Tjänster"
          data={tjanster}
          color="blue"
          onDelete={raderaTjänster}
          columns={[
            { key: "select", label: "" },
            {
              key: "id",
              label: "ID",
              width: "w-24",
              render: (t) => (
                <span
                  className="text-sm text-slate-500 font-mono max-w-[6rem] truncate block"
                  title={t.id}
                >
                  {t.id}
                </span>
              ),
            },
            {
              key: "namn",
              label: "Namn",
              render: (t) => <span className="font-medium">{t.namn}</span>,
            },
            {
              key: "kategori",
              label: "Kategori",
              render: (t) =>
                t.kategori ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {t.kategori}
                  </span>
                ) : (
                  <span className="text-slate-400 italic text-sm">Ingen</span>
                ),
            },
            {
              key: "pris",
              label: "Pris",
              render: (t) => (
                <span className="font-semibold text-amber-600">{t.pris / 100} kr</span>
              ),
            },
            { key: "varaktighet", label: "Varaktighet", render: (t) => `${t.varaktighet} min` },
            {
              key: "aktiv",
              label: "Status",
              render: (t) =>
                t.aktiv ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Aktiv
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ✗ Inaktiv
                  </span>
                ),
            },
          ]}
        />

        <DebugTable
          title="Bokningar"
          data={bokningar}
          color="purple"
          onDelete={raderaBokningar}
          columns={[
            { key: "select", label: "" },
            {
              key: "id",
              label: "ID",
              width: "w-24",
              render: (b) => (
                <span
                  className="text-sm text-slate-500 font-mono max-w-[6rem] truncate block"
                  title={b.id}
                >
                  {b.id}
                </span>
              ),
            },
            {
              key: "startTid",
              label: "Starttid",
              render: (b) => new Date(b.startTid).toLocaleString("sv-SE"),
            },
            {
              key: "status",
              label: "Status",
              render: (b) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {b.status}
                </span>
              ),
            },
            {
              key: "kundId",
              label: "Kund ID",
              render: (b) => <span className="text-sm text-slate-600 font-mono">{b.kundId}</span>,
            },
            {
              key: "tjanstId",
              label: "Tjänst ID",
              render: (b) => <span className="text-sm text-slate-600 font-mono">{b.tjanstId}</span>,
            },
          ]}
        />

        <DebugTable
          title="Användare"
          data={anvandare}
          color="green"
          onDelete={raderaAnvändare}
          columns={[
            { key: "select", label: "" },
            {
              key: "id",
              label: "ID",
              width: "w-24",
              render: (a) => (
                <span
                  className="text-sm text-slate-500 font-mono max-w-[6rem] truncate block"
                  title={a.id}
                >
                  {a.id}
                </span>
              ),
            },
            {
              key: "namn",
              label: "Namn",
              render: (a) => <span className="font-medium">{a.namn}</span>,
            },
            { key: "email", label: "Email" },
            {
              key: "roll",
              label: "Roll",
              render: (a) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {a.roll}
                </span>
              ),
            },
          ]}
        />

        <DebugTable
          title="Utförare"
          data={utforare}
          color="amber"
          onDelete={raderaUtförare}
          columns={[
            { key: "select", label: "" },
            {
              key: "id",
              label: "ID",
              width: "w-24",
              render: (u) => (
                <span
                  className="text-sm text-slate-500 font-mono max-w-[6rem] truncate block"
                  title={u.id}
                >
                  {u.id}
                </span>
              ),
            },
            {
              key: "namn",
              label: "Namn",
              render: (u) => <span className="font-medium">{u.namn}</span>,
            },
            { key: "email", label: "Email", render: (u) => u.email || "-" },
            { key: "telefon", label: "Telefon", render: (u) => u.telefon || "-" },
            {
              key: "aktiv",
              label: "Status",
              render: (u) =>
                u.aktiv ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Aktiv
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ✗ Inaktiv
                  </span>
                ),
            },
          ]}
        />

        <DebugTable
          title="Utförare ↔ Tjänster Kopplingar"
          data={utforareTjanster}
          color="pink"
          onDelete={raderaUtförareTjänster}
          columns={[
            { key: "select", label: "" },
            {
              key: "id",
              label: "ID",
              width: "w-24",
              render: (ut) => (
                <span
                  className="text-sm text-slate-500 font-mono max-w-[6rem] truncate block"
                  title={ut.id}
                >
                  {ut.id}
                </span>
              ),
            },
            {
              key: "utforareId",
              label: "Utförare ID",
              render: (ut) => (
                <span className="text-sm text-slate-600 font-mono">{ut.utforareId}</span>
              ),
            },
            {
              key: "tjanstId",
              label: "Tjänst ID",
              render: (ut) => (
                <span className="text-sm text-slate-600 font-mono">{ut.tjanstId}</span>
              ),
            },
            {
              key: "skapadDatum",
              label: "Skapad",
              render: (ut) => new Date(ut.skapadDatum).toLocaleString("sv-SE"),
            },
          ]}
        />
      </div>
    </div>
  );
}
