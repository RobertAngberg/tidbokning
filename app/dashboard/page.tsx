import { hämtaBokningar } from "./actions/bokningar";
import { hämtaTjänster } from "./actions/tjanster";
import { hämtaUtförare } from "./actions/utforare";
import { hamtaForetag } from "./actions/foretag";
import { DashboardClient } from "./components/DashboardClient";
import { DashboardLogin } from "./components/DashboardLogin";
import { auth } from "../_server/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Om inte inloggad, visa login-formulär
  if (!session) {
    return <DashboardLogin />;
  }

  // Kolla att användaren har admin-roll
  if (session.user.roll !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Åtkomst nekad</h1>
          <p className="text-stone-600">Endast administratörer har tillgång till dashboard.</p>
        </div>
      </div>
    );
  }

  const [bokningar, tjanster, utforareResult, foretagResult] = await Promise.all([
    hämtaBokningar(),
    hämtaTjänster(),
    hämtaUtförare(),
    hamtaForetag(),
  ]);

  const foretag = foretagResult.success ? foretagResult.data : null;
  const utforare = utforareResult.success ? utforareResult.data : [];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardClient
          bokningar={bokningar}
          tjanster={tjanster}
          utforare={utforare}
          foretag={foretag ?? null}
        />
      </div>
    </div>
  );
}
