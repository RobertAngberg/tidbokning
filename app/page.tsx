import { hämtaBokningar, hämtaTjänster } from "@/_server/actions/bokningar";
import { BokningsFormular } from "@/bokningar/BokningsFormular";
import { BokningsLista } from "@/bokningar/BokningsLista";
import { BokningsSchema } from "@/bokningar/BokningsSchema";

export default async function HomePage() {
  const tjänster = await hämtaTjänster();
  const bokningar = await hämtaBokningar();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Välkommen till Tidbokning</h1>
          <p className="text-muted-foreground">
            Ett modernt tidsbokningssystem byggt med Next.js 16 och React 19
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <BokningsFormular tjänster={tjänster} />
          <BokningsLista bokningar={bokningar} />
        </div>

        <BokningsSchema bokningar={bokningar} />
      </div>
    </div>
  );
}
