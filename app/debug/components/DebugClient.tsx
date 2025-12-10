"use client";

import { DebugTable } from "./DebugTable";
import {
  raderaTjänster,
  raderaBokningar,
  raderaAnvändare,
  raderaKunder,
  raderaRecensioner,
  raderaUtförare,
  raderaUtförareTjänster,
  raderaUsers,
  raderaFöretag,
} from "../actions";
import type { Tjanst } from "../../_server/db/schema/tjanster";
import type { Bokning } from "../../_server/db/schema/bokningar";
import type { Anvandare } from "../../_server/db/schema/anvandare";
import type { Kund } from "../../_server/db/schema/kunder";
import type { Utforare } from "../../_server/db/schema/utforare";
import type { Foretag } from "../../_server/db/schema/foretag";

interface UtforareTjanster {
  id: string;
  utforareId: string;
  tjanstId: string;
  skapadDatum: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  roll: "admin" | "personal" | "kund";
  foretagsslug: string | null;
}

interface Recension {
  id: string;
  kundId: string;
  bokningId: string;
  foretagsslug: string;
  betyg: number;
  kommentar: string | null;
  skapadDatum: Date;
}

interface DebugClientProps {
  tjanster: Tjanst[];
  bokningar: Bokning[];
  anvandare: Anvandare[];
  kunder: Kund[];
  recensioner: Recension[];
  utforare: Utforare[];
  utforareTjanster: UtforareTjanster[];
  users: User[];
  foretag: Foretag[];
  sessions: any[];
  accounts: any[];
  verifications: any[];
}

export function DebugClient({
  tjanster,
  bokningar,
  anvandare,
  kunder,
  recensioner,
  utforare,
  utforareTjanster,
  users,
  foretag,
  sessions,
  accounts,
  verifications,
}: DebugClientProps) {
  const sections = [
    { id: "users", label: "Users", color: "purple" },
    { id: "foretag", label: "Företag", color: "blue" },
    { id: "tjanster", label: "Tjänster", color: "green" },
    { id: "bokningar", label: "Bokningar", color: "amber" },
    { id: "kunder", label: "Kunder", color: "teal" },
    { id: "recensioner", label: "Recensioner", color: "rose" },
    { id: "anvandare", label: "Användare (legacy)", color: "orange" },
    { id: "utforare", label: "Utförare", color: "pink" },
    { id: "utforare-tjanster", label: "Tjänster per utförare", color: "cyan" },
    { id: "sessions", label: "Sessions", color: "indigo" },
    { id: "accounts", label: "Accounts", color: "violet" },
    { id: "verifications", label: "Verifications", color: "fuchsia" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 100; // Höjden på navigation + lite extra margin
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="sticky top-4 z-50 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-slate-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => scrollToSection("users")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-slate-600 hover:bg-slate-700 text-white"
            >
              Users
            </button>
            <button
              onClick={() => scrollToSection("foretag")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-blue-600 hover:bg-blue-700 text-white"
            >
              Företag
            </button>
            <button
              onClick={() => scrollToSection("tjanster")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Tjänster
            </button>
            <button
              onClick={() => scrollToSection("bokningar")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-amber-600 hover:bg-amber-700 text-white"
            >
              Bokningar
            </button>
            <button
              onClick={() => scrollToSection("kunder")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-teal-600 hover:bg-teal-700 text-white"
            >
              Kunder
            </button>
            <button
              onClick={() => scrollToSection("recensioner")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-rose-600 hover:bg-rose-700 text-white"
            >
              Recensioner
            </button>
            <button
              onClick={() => scrollToSection("anvandare")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-orange-600 hover:bg-orange-700 text-white"
            >
              Användare
            </button>
            <button
              onClick={() => scrollToSection("utforare")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-pink-600 hover:bg-pink-700 text-white"
            >
              Utförare
            </button>
            <button
              onClick={() => scrollToSection("utforare-tjanster")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Tjänster per utförare
            </button>
            <button
              onClick={() => scrollToSection("sessions")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Sessions
            </button>
            <button
              onClick={() => scrollToSection("accounts")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-violet-600 hover:bg-violet-700 text-white"
            >
              Accounts
            </button>
            <button
              onClick={() => scrollToSection("verifications")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] bg-rose-600 hover:bg-rose-700 text-white"
            >
              Verifications
            </button>
          </div>
        </div>

        <div id="users">
          <DebugTable
            title="Better Auth Users"
            data={users}
            color="purple"
            onDelete={raderaUsers}
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
                key: "name",
                label: "Namn",
                render: (u) => <span className="font-medium">{u.name}</span>,
              },
              {
                key: "email",
                label: "Email",
                render: (u) => <span className="text-sm">{u.email}</span>,
              },
              {
                key: "roll",
                label: "Roll",
                render: (u) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.roll === "admin"
                        ? "bg-red-100 text-red-800"
                        : u.roll === "personal"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {u.roll}
                  </span>
                ),
              },
              {
                key: "foretagsslug",
                label: "Företag",
                render: (u) =>
                  u.foretagsslug ? (
                    <span className="text-sm font-mono">{u.foretagsslug}</span>
                  ) : (
                    <span className="text-slate-400 italic text-sm">Ingen</span>
                  ),
              },
            ]}
          />
        </div>

        <div id="foretag">
          <DebugTable
            title="Företag"
            data={foretag}
            color="blue"
            onDelete={raderaFöretag}
            columns={[
              { key: "select", label: "" },
              {
                key: "id",
                label: "ID",
                width: "w-24",
                render: (f) => (
                  <span
                    className="text-sm text-slate-500 font-mono max-w-[6rem] truncate block"
                    title={f.id}
                  >
                    {f.id}
                  </span>
                ),
              },
              {
                key: "namn",
                label: "Namn",
                render: (f) => <span className="font-medium">{f.namn}</span>,
              },
              {
                key: "slug",
                label: "Slug",
                render: (f) => <span className="text-sm font-mono text-slate-600">{f.slug}</span>,
              },
              {
                key: "telefon",
                label: "Telefon",
                render: (f) =>
                  f.telefon ? (
                    <span className="text-sm">{f.telefon}</span>
                  ) : (
                    <span className="text-slate-400 italic text-sm">-</span>
                  ),
              },
              {
                key: "email",
                label: "Email",
                render: (f) =>
                  f.email ? (
                    <span className="text-sm">{f.email}</span>
                  ) : (
                    <span className="text-slate-400 italic text-sm">-</span>
                  ),
              },
              {
                key: "aktiv",
                label: "Status",
                render: (f) =>
                  f.aktiv ? (
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
        </div>

        <div id="tjanster">
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
        </div>

        <div id="bokningar">
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
                render: (b) => (
                  <span className="text-sm text-slate-600 font-mono">{b.tjanstId}</span>
                ),
              },
            ]}
          />
        </div>

        <div id="kunder">
          <DebugTable
            title="Kunder"
            data={kunder}
            color="teal"
            onDelete={raderaKunder}
            columns={[
              { key: "select", label: "" },
              {
                key: "id",
                label: "ID",
                width: "w-24",
                render: (k) => (
                  <span
                    className="text-sm text-slate-500 font-mono max-w-[6rem] truncate block"
                    title={k.id}
                  >
                    {k.id}
                  </span>
                ),
              },
              {
                key: "namn",
                label: "Namn",
                render: (k) => <span className="font-medium">{k.namn}</span>,
              },
              { key: "email", label: "Email" },
              { key: "telefon", label: "Telefon", render: (k) => k.telefon || "-" },
              {
                key: "foretagsslug",
                label: "Företag",
                render: (k) =>
                  k.foretagsslug ? (
                    <span className="text-sm font-mono">{k.foretagsslug}</span>
                  ) : (
                    <span className="text-slate-400 italic text-sm">Ingen</span>
                  ),
              },
            ]}
          />
        </div>

        <div id="recensioner">
          <DebugTable
            title="Recensioner"
            data={recensioner}
            color="pink"
            onDelete={raderaRecensioner}
            columns={[
              { key: "select", label: "" },
              {
                key: "id",
                label: "ID",
                width: "w-24",
                render: (r) => (
                  <span
                    className="text-sm text-slate-500 font-mono max-w-[6rem] truncate block"
                    title={r.id}
                  >
                    {r.id}
                  </span>
                ),
              },
              {
                key: "betyg",
                label: "Betyg",
                render: (r) => (
                  <span className="font-semibold text-amber-600">
                    {"★".repeat(r.betyg)}
                    {"☆".repeat(5 - r.betyg)}
                  </span>
                ),
              },
              {
                key: "kommentar",
                label: "Kommentar",
                render: (r) =>
                  r.kommentar ? (
                    <span className="text-sm max-w-xs truncate block" title={r.kommentar}>
                      {r.kommentar}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-sm">Ingen kommentar</span>
                  ),
              },
              {
                key: "foretagsslug",
                label: "Företag",
                render: (r) => <span className="text-sm font-mono">{r.foretagsslug}</span>,
              },
              {
                key: "skapadDatum",
                label: "Skapad",
                render: (r) => new Date(r.skapadDatum).toLocaleDateString("sv-SE"),
              },
            ]}
          />
        </div>

        <div id="anvandare">
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
        </div>

        <div id="utforare">
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
                key: "foretagsslug",
                label: "Företag",
                render: (u) => (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {u.foretagsslug}
                  </span>
                ),
              },
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
        </div>

        <div id="utforare-tjanster">
          <DebugTable
            title="Tjänster per utförare"
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

        <div id="sessions">
          <DebugTable
            title="Sessions"
            data={sessions}
            color="cyan"
            columns={[
              {
                key: "id",
                label: "ID",
                width: "w-32",
                render: (s) => (
                  <span className="text-sm text-slate-500 font-mono truncate block" title={s.id}>
                    {s.id.substring(0, 12)}...
                  </span>
                ),
              },
              {
                key: "userId",
                label: "User ID",
                width: "w-32",
                render: (s) => (
                  <span
                    className="text-sm text-slate-500 font-mono truncate block"
                    title={s.userId}
                  >
                    {s.userId.substring(0, 12)}...
                  </span>
                ),
              },
              {
                key: "expiresAt",
                label: "Utgår",
                render: (s) => new Date(s.expiresAt).toLocaleString("sv-SE"),
              },
              {
                key: "ipAddress",
                label: "IP",
                render: (s) => <span className="text-sm font-mono">{s.ipAddress || "-"}</span>,
              },
            ]}
          />
        </div>

        <div id="accounts">
          <DebugTable
            title="Accounts"
            data={accounts}
            color="teal"
            columns={[
              {
                key: "id",
                label: "ID",
                width: "w-24",
                render: (a) => (
                  <span className="text-sm text-slate-500 font-mono truncate block" title={a.id}>
                    {a.id.substring(0, 10)}...
                  </span>
                ),
              },
              {
                key: "userId",
                label: "User ID",
                width: "w-32",
                render: (a) => (
                  <span
                    className="text-sm text-slate-500 font-mono truncate block"
                    title={a.userId}
                  >
                    {a.userId.substring(0, 12)}...
                  </span>
                ),
              },
              {
                key: "providerId",
                label: "Provider",
                render: (a) => <span className="text-sm">{a.providerId}</span>,
              },
              {
                key: "createdAt",
                label: "Skapad",
                render: (a) => new Date(a.createdAt).toLocaleString("sv-SE"),
              },
            ]}
          />
        </div>

        <div id="verifications">
          <DebugTable
            title="Verifications"
            data={verifications}
            color="lime"
            columns={[
              {
                key: "id",
                label: "ID",
                width: "w-24",
                render: (v) => (
                  <span className="text-sm text-slate-500 font-mono truncate block" title={v.id}>
                    {v.id.substring(0, 10)}...
                  </span>
                ),
              },
              {
                key: "identifier",
                label: "Identifier",
                render: (v) => <span className="text-sm">{v.identifier}</span>,
              },
              {
                key: "value",
                label: "Value",
                render: (v) => <span className="text-sm font-mono">{v.value}</span>,
              },
              {
                key: "expiresAt",
                label: "Utgår",
                render: (v) => new Date(v.expiresAt).toLocaleString("sv-SE"),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
