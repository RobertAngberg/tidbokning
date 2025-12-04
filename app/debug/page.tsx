import { db } from "../_server/db";
import { tjanster } from "../_server/db/schema/tjanster";
import { bokningar } from "../_server/db/schema/bokningar";
import { anvandare } from "../_server/db/schema/anvandare";
import { utforare, utforareTjanster } from "../_server/db/schema/utforare";

export default async function DebugPage() {
  const allTjanster = await db.select().from(tjanster);
  const allBokningar = await db.select().from(bokningar);
  const allAnvandare = await db.select().from(anvandare);
  const allUtforare = await db.select().from(utforare);
  const allUtforareTjanster = await db.select().from(utforareTjanster);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Database Debug</h1>
          <p className="text-slate-600">Översikt över allt innehåll i databasen</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Tjänster</h2>
            <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold">
              {allTjanster.length} st
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Namn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Beskrivning
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Pris
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Varaktighet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {allTjanster.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td
                      className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 font-mono max-w-[6rem] truncate"
                      title={t.id}
                    >
                      {t.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {t.namn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {t.kategori ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {t.kategori}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Ingen kategori</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {t.beskrivning}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-amber-600">
                      {t.pris / 100} kr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {t.varaktighet} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {t.aktiv ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Aktiv
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          ✗ Inaktiv
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Bokningar</h2>
            <span className="bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-semibold">
              {allBokningar.length} st
            </span>
          </div>
          {allBokningar.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">Inga bokningar ännu</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Starttid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Kund ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Tjänst ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {allBokningar.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td
                        className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 font-mono max-w-[6rem] truncate"
                        title={b.id}
                      >
                        {b.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {new Date(b.startTid).toLocaleString("sv-SE")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {b.kundId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {b.tjanstId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Användare</h2>
            <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold">
              {allAnvandare.length} st
            </span>
          </div>
          {allAnvandare.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="text-lg font-medium">Inga användare ännu</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Namn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Roll
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {allAnvandare.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td
                        className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 font-mono max-w-[6rem] truncate"
                        title={a.id}
                      >
                        {a.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {a.namn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {a.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {a.roll}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Utförare</h2>
            <span className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-semibold">
              {allUtforare.length} st
            </span>
          </div>
          {allUtforare.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-lg font-medium">Inga utförare ännu</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Namn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Telefon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Beskrivning
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {allUtforare.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td
                        className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 font-mono max-w-[6rem] truncate"
                        title={u.id}
                      >
                        {u.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {u.namn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {u.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {u.telefon || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {u.beskrivning || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.aktiv ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Aktiv
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ✗ Inaktiv
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Utförare ↔ Tjänster Kopplingar</h2>
            <span className="bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full text-sm font-semibold">
              {allUtforareTjanster.length} st
            </span>
          </div>
          {allUtforareTjanster.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <p className="text-lg font-medium">Inga kopplingar ännu</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Utförare ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Tjänst ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Skapad
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {allUtforareTjanster.map((ut) => (
                    <tr key={ut.id} className="hover:bg-slate-50 transition-colors">
                      <td
                        className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 font-mono max-w-[6rem] truncate"
                        title={ut.id}
                      >
                        {ut.id}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono max-w-xs truncate"
                        title={ut.utforareId}
                      >
                        {ut.utforareId}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono max-w-xs truncate"
                        title={ut.tjanstId}
                      >
                        {ut.tjanstId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(ut.skapadDatum).toLocaleString("sv-SE")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
