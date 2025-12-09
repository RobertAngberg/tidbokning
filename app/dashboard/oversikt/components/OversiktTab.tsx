import { Card } from "../../../_components/Card";

export function OversiktTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Bokningar idag</div>
          <div className="text-3xl font-bold mt-2">0</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Denna vecka</div>
          <div className="text-3xl font-bold mt-2">0</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Denna månad</div>
          <div className="text-3xl font-bold mt-2">0</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Omsättning</div>
          <div className="text-3xl font-bold mt-2">0 kr</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Kommande bokningar</h3>
          <div className="text-sm text-muted-foreground">Inga kommande bokningar</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Populäraste tjänster</h3>
          <div className="text-sm text-muted-foreground">Ingen data ännu</div>
        </Card>
      </div>
    </div>
  );
}
