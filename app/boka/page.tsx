import { hämtaBokningar, hämtaTjänster } from "../bokningar/actions/bokningar";
import { KalenderSchema } from "../kalender/components/KalenderSchema";
import { BokaClient } from "./components/BokaClient";

export default async function BokaPage() {
  const [bokningar, tjänster] = await Promise.all([hämtaBokningar(), hämtaTjänster()]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Tjänster sektion */}
        <section>
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-6xl text-white font-[family-name:var(--font-newsreader)]">Boka</h1>
            <p className="text-xl text-white font-[family-name:var(--font-newsreader)]">
              Välj en tjänst och se lediga tider
            </p>
          </div>

          <BokaClient tjänster={tjänster} />

          <div className="bg-amber-50 rounded-xl p-8 border border-amber-200 mt-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-800 mb-2">
                  Behöver du hjälp med att välja?
                </h3>
                <p className="text-stone-600">
                  Kontakta oss gärna så hjälper vi dig att hitta rätt tjänst för dina behov. Alla
                  priser är inklusive moms och du kan alltid avboka kostnadsfritt upp till 24 timmar
                  innan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Kalender sektion */}
        <section>
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-4xl text-white font-[family-name:var(--font-newsreader)]">
              Lediga Tider
            </h2>
            <p className="text-lg text-white/90 font-[family-name:var(--font-newsreader)]">
              Översikt över alla bokningar i kalendern
            </p>
          </div>
          <KalenderSchema bokningar={bokningar} />
        </section>
      </div>
    </div>
  );
}
