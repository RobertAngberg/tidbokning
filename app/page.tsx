import { hämtaTjänster } from "./_server/actions/bokningar";
import { BokningsFormular } from "./bokningar/BokningsFormular";

export default async function HomePage() {
  const tjänster = await hämtaTjänster();

  return (
    <div className="relative h-screen">
      {/* Less blur for homepage */}
      <div className="fixed inset-0 -z-10 backdrop-blur-sm" />

      {/* Innehåll */}
      <div className="relative p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-6xl text-white font-[family-name:var(--font-newsreader)]">
              Boka en tid
            </h1>
            <p className="text-xl text-white font-[family-name:var(--font-newsreader)]">
              Välj en tjänst och ett lämpligt datum för din bokning
            </p>
          </div>

          <BokningsFormular tjänster={tjänster} />
        </div>
      </div>
    </div>
  );
}
