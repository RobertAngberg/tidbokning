import { Card } from "../../_components/Card";

export function InstallningarTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inställningar</h2>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Företagsinformation</h3>
        <div className="text-muted-foreground mb-4">Namn, adress, telefon, email, logo</div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Öppettider</h3>
        <div className="text-muted-foreground mb-4">
          Konfigurera öppettider per dag, timeslot-längder (15, 30, 45, 60 min)
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tema</h3>
        <div className="text-muted-foreground">Färgval och utseende</div>
      </Card>
    </div>
  );
}
