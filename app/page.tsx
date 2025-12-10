import { SokForetag } from "./sok/components/SokForetag";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 -mt-18">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold text-white font-[family-name:var(--font-newsreader)]">
            Hitta & Boka
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Sök efter företag och boka dina behandlingar enkelt
          </p>
        </div>

        <SokForetag />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-white mb-2">Sök & Hitta</h3>
            <p className="text-white/80 text-sm">
              Hitta det perfekta salongen, spaet eller kliniken nära dig
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-lg font-bold text-white mb-2">Boka Online</h3>
            <p className="text-white/80 text-sm">Välj tid som passar dig, utan att behöva ringa</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-bold text-white mb-2">Bekräftas Direkt</h3>
            <p className="text-white/80 text-sm">Få omedelbar bekräftelse via email och sms</p>
          </div>
        </div>
      </div>
    </div>
  );
}
