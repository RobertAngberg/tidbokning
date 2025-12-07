import { hämtaBokningar } from "./actions/bokningar";
import { hämtaTjänster } from "./actions/tjanster";
import { hämtaPersonal } from "./actions/personal";
import { hamtaForetag } from "./actions/foretag";
import { DashboardClient } from "./components/DashboardClient";

export default async function DashboardPage() {
  const [bokningar, tjanster, personal, foretagResult] = await Promise.all([
    hämtaBokningar(),
    hämtaTjänster(),
    hämtaPersonal(),
    hamtaForetag(),
  ]);

  const foretag = foretagResult.success ? foretagResult.data : null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardClient
          bokningar={bokningar}
          tjanster={tjanster}
          personal={personal}
          foretag={foretag ?? null}
        />
      </div>
    </div>
  );
}
