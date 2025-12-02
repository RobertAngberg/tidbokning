import { hämtaBokningar } from "../bokningar/actions/bokningar";
import { KalenderSchema } from "./components/KalenderSchema";

export default async function KalenderPage() {
  const bokningar = await hämtaBokningar();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-6xl text-white font-[family-name:var(--font-newsreader)]">
            Kalender
          </h1>
          <p className="text-xl text-white font-[family-name:var(--font-newsreader)]">
            Översikt över alla bokningar i kalendern
          </p>
        </div>

        <KalenderSchema bokningar={bokningar} />
      </div>
    </div>
  );
}
