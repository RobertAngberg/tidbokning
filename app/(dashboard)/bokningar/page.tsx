import { hämtaBokningar, hämtaTjänster } from "@/_server/actions/bokningar";
import { BokningsFormular } from "@/bokningar/BokningsFormular";
import { BokningsLista } from "@/bokningar/BokningsLista";
import { BokningsSchema } from "@/bokningar/BokningsSchema";

export default async function BokningarPage() {
  const bokningar = await hämtaBokningar();
  const tjänster = await hämtaTjänster();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bokningar</h1>
        <p className="text-muted-foreground">Hantera dina bokningar här</p>
      </div>

      <div className="flex gap-6">
        <div className="w-1/2">
          <BokningsFormular tjänster={tjänster} />
        </div>
        <div className="w-1/2">
          <BokningsLista bokningar={bokningar} />
        </div>
      </div>

      <BokningsSchema bokningar={bokningar} />
    </div>
  );
}
