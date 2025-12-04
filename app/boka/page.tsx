import { hämtaTjänster } from "../bokningar/actions/bokningar";
import { BokaClient } from "./components/BokaClient";

export default async function BokaPage() {
  const tjänster = await hämtaTjänster();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-8 pt-12 pb-8">
        <h1 className="text-5xl font-bold text-white mb-8 font-[family-name:var(--font-newsreader)]">
          Roberts Massage och Spa
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vänster kolumn - Tjänster (2/3) */}
          <div className="lg:col-span-2">
            <BokaClient tjänster={tjänster} />
          </div>

          {/* Höger kolumn - Information (1/3) */}
          <div className="space-y-6">
            {/* Öppettider */}
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Öppettider
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Måndag - Fredag</span>
                  <span className="font-semibold text-stone-800">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Lördag</span>
                  <span className="font-semibold text-stone-800">10:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Söndag</span>
                  <span className="font-semibold text-stone-800">Stängt</span>
                </div>
              </div>
            </div>

            {/* Kontakt */}
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Kontakt
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-stone-500 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="text-stone-600">Telefon</p>
                    <p className="font-semibold text-stone-800">08-123 456 78</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-stone-500 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-stone-600">E-post</p>
                    <p className="font-semibold text-stone-800">info@tidbokning.se</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal */}
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Personal
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0 overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/lorelei/png?seed=erik123&size=96"
                      alt="Erik Nilsson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">Erik Nilsson</p>
                    <p className="text-stone-600 text-xs">Thaimassage, Ryggmassage</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0 overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/lorelei/png?seed=anna456&size=96"
                      alt="Anna Andersson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">Anna Andersson</p>
                    <p className="text-stone-600 text-xs">Oljemassage, Duomassage</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0 overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/lorelei/png?seed=maria789&size=96"
                      alt="Maria Svensson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">Maria Svensson</p>
                    <p className="text-stone-600 text-xs">Fotbehandling, Spa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Adress */}
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Var vi finns
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-stone-800">Wellness Studio</p>
                <p className="text-stone-600">Storgatan 123</p>
                <p className="text-stone-600">111 22 Stockholm</p>
              </div>
            </div>

            {/* Om oss */}
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-600"
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
                Om oss
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Välkommen till vår massagestudio där vi erbjuder professionella behandlingar i en
                lugn och harmonisk miljö. Våra erfarna massörer har mångårig erfarenhet och är här
                för att ge dig bästa möjliga upplevelse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
