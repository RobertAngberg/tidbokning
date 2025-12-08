"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../_components/Tabs";
import { OversiktTab } from "./OversiktTab";
import { BokningarTab } from "./BokningarTab";
import { TjansterTab } from "./TjansterTab";
import { UtforareTab } from "./UtforareTab";
import { InstallningarTab } from "./InstallningarTab";
import type { Bokning } from "../../_server/db/schema/bokningar";
import type { Anvandare } from "../../_server/db/schema/anvandare";
import type { Tjanst } from "../../_server/db/schema/tjanster";
import type { Utforare } from "../../_server/db/schema/utforare";
import type { Foretag } from "../../_server/db/schema/foretag";

interface DashboardClientProps {
  bokningar: Array<Bokning & { kund: Anvandare | null; tjanst: Tjanst | null }>;
  tjanster: Tjanst[];
  utforare: Utforare[];
  foretag: Foretag | null;
}

export function DashboardClient({ bokningar, tjanster, utforare, foretag }: DashboardClientProps) {
  return (
    // Tabs-container håller koll på vilken tab som är aktiv
    <Tabs defaultValue="oversikt">
      {/* TabsList = Den gråa menyn med knappar överst */}
      <div className="flex justify-center mb-8">
        <TabsList className="h-12 px-2">
          {/* TabsTrigger = Varje individuell knapp i menyn */}
          {/* "value" kopplar knappen till rätt TabsContent nedan */}
          <TabsTrigger value="oversikt" className="px-6">
            Översikt
          </TabsTrigger>
          <TabsTrigger value="bokningar" className="px-6">
            Bokningar
          </TabsTrigger>
          <TabsTrigger value="tjanster" className="px-6">
            Tjänster
          </TabsTrigger>
          <TabsTrigger value="utforare" className="px-6">
            Utförare
          </TabsTrigger>
          <TabsTrigger value="installningar" className="px-6">
            Inställningar
          </TabsTrigger>
        </TabsList>
      </div>

      {/* TabsContent = Innehållet som visas när en tab är aktiv */}
      {/* Endast den TabsContent vars "value" matchar den aktiva tabben visas */}

      <TabsContent value="oversikt">
        <OversiktTab />
      </TabsContent>

      <TabsContent value="bokningar">
        <BokningarTab bokningar={bokningar} />
      </TabsContent>

      <TabsContent value="tjanster">
        <TjansterTab tjanster={tjanster} />
      </TabsContent>

      <TabsContent value="utforare">
        <UtforareTab utforare={utforare} />
      </TabsContent>

      <TabsContent value="installningar">
        <InstallningarTab foretag={foretag} />
      </TabsContent>
    </Tabs>
  );
}
