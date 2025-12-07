import { hämtaBokningar } from "./actions/bokningar";
import { hämtaTjänster } from "./actions/tjanster";
import { hämtaPersonal } from "./actions/personal";
import { DashboardClient } from "./components/DashboardClient";

export default async function DashboardPage() {
  const [bokningar, tjanster, personal] = await Promise.all([
    hämtaBokningar(),
    hämtaTjänster(),
    hämtaPersonal(),
  ]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardClient bokningar={bokningar} tjanster={tjanster} personal={personal} />
      </div>
    </div>
  );
}
