import { hämtaBokningar } from "@/_server/actions/bokningar";
import { BokningsLista } from "@/bokningar/BokningsLista";

export default async function BokningarPage() {
  const bokningar = await hämtaBokningar();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Bokningar</h1>
          <p className="text-muted-foreground">Hantera och filtrera alla dina bokningar</p>
        </div>

        <BokningsLista bokningar={bokningar} />
      </div>
    </div>
  );
}
