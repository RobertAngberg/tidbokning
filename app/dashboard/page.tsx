import { hamtaBokningar } from "./bokningar/actions/bokningar";
import { hamtaTjanster } from "./tjanster/actions/tjanster";
import { hämtaUtförare } from "./utforare/actions/utforare";
import { hamtaForetag } from "./foretagsuppgifter/actions/foretag";
import { hamtaRecensioner, hamtaSnittbetyg } from "./recensioner/actions/recensioner";
import { hamtaLunchtider } from "./bokningar/actions/lunchtider";
import { DashboardClient } from "./_shared/components/DashboardClient";
import { DashboardLogin } from "./_shared/components/DashboardLogin";
import { auth } from "../_server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
    // Om användaren är kund och inte har företag, dirigera till onboarding
    if (!session.user.foretagsslug) {
      redirect("/onboarding");
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Åtkomst nekad</h1>
          <p className="text-stone-600">Endast administratörer har tillgång till dashboard.</p>
        </div>
      </div>
    );
  }

  // Hämta användarens företagsslug
  const foretagsslug = session.user.foretagsslug;

  if (!foretagsslug) {
    // Admin utan företag, dirigera till onboarding
    redirect("/onboarding");
  }

  const [bokningar, tjanster, utforareResult, foretagResult, recensioner, snittbetyg, lunchtider] =
    await Promise.all([
      hamtaBokningar(),
      hamtaTjanster(),
      hämtaUtförare(),
      hamtaForetag(foretagsslug),
      hamtaRecensioner(foretagsslug),
      hamtaSnittbetyg(foretagsslug),
      hamtaLunchtider(foretagsslug),
    ]);

  const foretag = foretagResult.success ? foretagResult.data : null;
  const utforare = utforareResult.success ? utforareResult.data || [] : [];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardClient
          bokningar={bokningar}
          tjanster={tjanster}
          utforare={utforare}
          foretag={foretag ?? null}
          recensioner={recensioner}
          snittbetyg={snittbetyg}
          lunchtider={lunchtider}
          foretagsslug={foretagsslug}
        />
      </div>
    </div>
  );
}
