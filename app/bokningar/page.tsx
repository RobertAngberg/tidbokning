import { hämtaBokningar } from "../_server/actions/bokningar";
import { BokningsLista } from "./BokningsLista";

export default async function BokningarPage() {
  const bokningar = await hämtaBokningar();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-6xl text-white font-[family-name:var(--font-newsreader)]">
            Bokningar
          </h1>
          <p className="text-xl text-white font-[family-name:var(--font-newsreader)]">
            Hantera och filtrera alla dina bokningar
          </p>
        </div>

        <BokningsLista bokningar={bokningar} />
      </div>
    </div>
  );
}
