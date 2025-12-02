import { hämtaTjänster } from "@/_server/actions/bokningar";
import { BokningsFormular } from "@/_components/bokningar/BokningsFormular";
import { BokningsLista } from "@/_components/bokningar/BokningsLista";

export default async function HomePage() {
  const tjänster = await hämtaTjänster();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Välkommen till Tidbokning</h1>
          <p className="text-muted-foreground">
            Ett modernt tidsbokningssystem byggt med Next.js 16 och React 19
          </p>
        </div>

        <div className="flex gap-8">
          <div className="w-1/2">
            <BokningsFormular tjänster={tjänster} />
          </div>
          <div className="w-1/2">
            <BokningsLista />
          </div>
        </div>
      </div>
    </div>
  );
}
