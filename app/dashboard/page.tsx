import { hämtaBokningar } from "./actions/bokningar";
import { BokningarClient } from "./components/BokningarClient";
import { KalenderSchema } from "../kalender/components/KalenderSchema";

export default async function BokningarPage() {
  const bokningar = await hämtaBokningar();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kalender - 2/3 */}
          <div className="lg:col-span-2">
            <KalenderSchema bokningar={bokningar} />
          </div>

          {/* Bokningslista - 1/3 */}
          <div>
            <BokningarClient bokningar={bokningar} />
          </div>
        </div>
      </div>
    </div>
  );
}
