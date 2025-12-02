import { hämtaTjänster } from "@/_server/actions/bokningar";
import { BokningsFormular } from "@/bokningar/BokningsFormular";

export default async function HomePage() {
  const tjänster = await hämtaTjänster();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Boka en tid</h1>
          <p className="text-muted-foreground">
            Välj en tjänst och ett lämpligt datum för din bokning
          </p>
        </div>

        <BokningsFormular tjänster={tjänster} />
      </div>
    </div>
  );
}
