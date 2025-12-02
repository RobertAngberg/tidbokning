import { hämtaBokningar } from "@/_server/actions/bokningar";
import { BokningsSchema } from "@/bokningar/BokningsSchema";

export default async function SchemaPage() {
  const bokningar = await hämtaBokningar();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Bokningsschema</h1>
          <p className="text-muted-foreground">Översikt över alla bokningar i kalendern</p>
        </div>

        <BokningsSchema bokningar={bokningar} />
      </div>
    </div>
  );
}
