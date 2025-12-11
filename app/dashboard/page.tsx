import { hamtaBokningar } from "./bokningar/actions/bokningar";
import { hamtaTjanster } from "./tjanster/actions/tjanster";
import { hamtaKategorier } from "./tjanster/actions/kategorier";
import { hämtaUtförare } from "./utforare/actions/utforare";
import { hamtaForetag } from "./foretagsuppgifter/actions/foretag";
import { hamtaRecensioner, hamtaSnittbetyg } from "./recensioner/actions/recensioner";
import { hamtaLunchtider } from "./bokningar/actions/lunchtider";
import { hamtaOppettider } from "./oppettider/actions/oppettider";
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

  const [
    bokningar,
    tjanster,
    kategorier,
    utforareResult,
    foretagResult,
    recensioner,
    snittbetyg,
    lunchtider,
    oppettiderArray,
  ] = await Promise.all([
    hamtaBokningar(),
    hamtaTjanster(),
    hamtaKategorier(foretagsslug),
    hämtaUtförare(),
    hamtaForetag(foretagsslug),
    hamtaRecensioner(foretagsslug),
    hamtaSnittbetyg(foretagsslug),
    hamtaLunchtider(foretagsslug),
    hamtaOppettider(),
  ]);

  const foretag = foretagResult.success ? foretagResult.data : null;
  const utforare = utforareResult.success ? utforareResult.data || [] : [];

  // Konvertera öppettider till format som kalendern förstår
  const oppettider = oppettiderArray.reduce((acc, o) => {
    acc[o.veckodag] = {
      open: o.oppnar ? o.oppnar.substring(0, 5) : "08:00", // "HH:MM:SS" -> "HH:MM"
      close: o.stanger ? o.stanger.substring(0, 5) : "17:00", // "HH:MM:SS" -> "HH:MM"
      stangt: o.stangt,
      lunchStart: o.lunchStart || null,
      lunchSlut: o.lunchSlut || null,
    };
    return acc;
  }, {} as { [key: string]: { open: string; close: string; stangt: boolean; lunchStart: string | null; lunchSlut: string | null } });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardClient
          bokningar={bokningar}
          tjanster={tjanster}
          kategorier={kategorier}
          utforare={utforare}
          foretag={foretag ?? null}
          recensioner={recensioner}
          snittbetyg={snittbetyg}
          lunchtider={lunchtider}
          foretagsslug={foretagsslug}
          oppettider={oppettider}
        />
      </div>
    </div>
  );
}
