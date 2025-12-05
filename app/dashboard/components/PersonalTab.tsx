import { Card } from "../../_components/Card";

export function PersonalTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Personal</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          + Lägg till medarbetare
        </button>
      </div>

      <Card className="p-6">
        <div className="text-muted-foreground">
          Personalhantering kommer här - CRUD för medarbetare, profilbilder, koppling till tjänster
        </div>
      </Card>
    </div>
  );
}
