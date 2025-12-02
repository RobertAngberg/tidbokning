import { hämtaAllaTjänster } from "@/_server/actions/tjanster";
import { TjänsterLista } from "@/tjanster/TjänsterLista";
import { SkapaTjänstFormulär } from "@/tjanster/SkapaTjänstFormulär";

export default async function TjänsterPage() {
  const tjänster = await hämtaAllaTjänster();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tjänsthantering</h1>
        <p className="text-muted-foreground">Hantera dina tjänster och priser</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <SkapaTjänstFormulär />
        </div>
        <div className="md:col-span-2">
          <TjänsterLista tjänster={tjänster} />
        </div>
      </div>
    </div>
  );
}
