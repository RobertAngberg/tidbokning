"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../_components/Tabs";
import { OversiktTab } from "../../oversikt/components/OversiktTab";
import { BokningarTab } from "../../bokningar/components/BokningarTab";
import { TjansterTab } from "../../tjanster/components/TjansterTab";
import { UtforareTab } from "../../utforare/components/UtforareTab";
import { BilderTab } from "../../bilder/components/BilderTab";
import { OppettiderTab } from "../../oppettider/components/OppettiderTab";
import { ForetagsuppgifterTab } from "../../foretagsuppgifter/components/ForetagsuppgifterTab";
import { RecensionerTab } from "../../recensioner/components/RecensionerTab";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Kategori } from "../../../_server/db/schema/kategorier";
import type { Utforare } from "../../../_server/db/schema/utforare";
import type { Foretag } from "../../../_server/db/schema/foretag";
import type { Lunchtid } from "../../../_server/db/schema/lunchtider";

interface DashboardClientProps {
  bokningar: Array<
    Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null }
  >;
  tjanster: Tjanst[];
  kategorier: Kategori[];
  utforare: Utforare[];
  foretag: Foretag | null;
  lunchtider: Lunchtid[];
  foretagsslug: string;
  recensioner: Array<{
    id: string;
    betyg: number;
    kommentar: string | null;
    skapadDatum: Date;
    kund: {
      namn: string;
    } | null;
  }>;
  snittbetyg: number | null;
  oppettider: {
    [key: string]: {
      open: string;
      close: string;
      stangt: boolean;
    };
  };
}

export function DashboardClient({
  bokningar,
  tjanster,
  kategorier,
  utforare,
  foretag,
  recensioner,
  snittbetyg,
  lunchtider,
  foretagsslug,
  oppettider,
}: DashboardClientProps) {
  return (
    <Tabs defaultValue="bokningar" className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar - vänster på desktop, överst på mobil */}
      <TabsList className="flex flex-row lg:flex-col w-full lg:w-64 lg:self-start h-auto bg-card rounded-lg p-2 overflow-x-auto lg:overflow-x-visible lg:sticky lg:top-6">
        <TabsTrigger
          value="bokningar"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Bokningar
        </TabsTrigger>
        <TabsTrigger
          value="oversikt"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Översikt
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
          value="bilder"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Bilder
        </TabsTrigger>
        <TabsTrigger
          value="oppettider"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Öppettider
        </TabsTrigger>
        <TabsTrigger
          value="installningar"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Företagsuppgifter
        </TabsTrigger>
        <TabsTrigger
          value="recensioner"
          className="flex-1 lg:w-full lg:justify-start px-4 py-3 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
        >
          Recensioner
        </TabsTrigger>
      </TabsList>

      {/* Content area */}
      <div className="flex-1">
        <TabsContent value="bokningar" className="mt-0">
          <BokningarTab
            bokningar={bokningar}
            tjanster={tjanster}
            utforare={utforare}
            lunchtider={lunchtider}
            foretagsslug={foretagsslug}
            foretag={foretag}
            oppettider={oppettider}
          />
        </TabsContent>

        <TabsContent value="oversikt" className="mt-0">
          <OversiktTab />
        </TabsContent>

        <TabsContent value="tjanster" className="mt-0">
          <TjansterTab tjanster={tjanster} kategorier={kategorier} foretagsslug={foretagsslug} />
        </TabsContent>

        <TabsContent value="utforare" className="mt-0">
          <UtforareTab utforare={utforare} />
        </TabsContent>

        <TabsContent value="bilder" className="mt-0">
          <BilderTab />
        </TabsContent>

        <TabsContent value="oppettider" className="mt-0">
          <OppettiderTab />
        </TabsContent>

        <TabsContent value="recensioner" className="mt-0">
          <RecensionerTab recensioner={recensioner} snittbetyg={snittbetyg} />
        </TabsContent>

        <TabsContent value="installningar" className="mt-0">
          <ForetagsuppgifterTab foretag={foretag} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
