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
    <Tabs defaultValue="oversikt" className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar - vänster på desktop, överst på mobil */}
      <TabsList className="flex flex-row lg:flex-col w-full lg:w-64 lg:self-start h-auto bg-card rounded-lg p-2 overflow-x-auto lg:overflow-x-visible lg:sticky lg:top-6">
        <TabsTrigger
          value="oversikt"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Översikt
        </TabsTrigger>
        <TabsTrigger
          value="bokningar"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Bokningar
        </TabsTrigger>
        <TabsTrigger
          value="tjanster"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Tjänster
        </TabsTrigger>
        <TabsTrigger
          value="utforare"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Utförare
        </TabsTrigger>
        <TabsTrigger
          value="installningar"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Inställningar
        </TabsTrigger>
      </TabsList>

      {/* Content area */}
      <div className="flex-1">
        <TabsContent value="oversikt" className="mt-0">
          <OversiktTab />
        </TabsContent>

        <TabsContent value="bokningar" className="mt-0">
          <BokningarTab bokningar={bokningar} />
        </TabsContent>

        <TabsContent value="tjanster" className="mt-0">
          <TjansterTab tjanster={tjanster} />
        </TabsContent>

        <TabsContent value="utforare" className="mt-0">
          <UtforareTab utforare={utforare} />
        </TabsContent>

        <TabsContent value="installningar" className="mt-0">
          <InstallningarTab foretag={foretag} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
