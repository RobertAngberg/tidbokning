import { hämtaTjänster } from "./_server/actions/bokningar";
import { BokningsFormular } from "./bokningar/BokningsFormular";
import Image from "next/image";

export default async function HomePage() {
  const tjänster = await hämtaTjänster();

  return (
    <div className="relative h-screen">
      {/* Bakgrundsbild */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?fm=jpg&q=100&fit=max&w=3840"
          alt="Abstrakt naturbakgrund"
          fill
          className="object-cover"
          priority
          quality={100}
          unoptimized
        />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Innehåll */}
      <div className="relative p-8 pt-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-6xl text-white font-[family-name:var(--font-newsreader)]">
              Boka en tid
            </h1>
            <p className="text-xl text-white font-[family-name:var(--font-newsreader)]">
              Välj en tjänst och ett lämpligt datum för din bokning
            </p>
          </div>

          <BokningsFormular tjänster={tjänster} />
        </div>
      </div>
    </div>
  );
}
