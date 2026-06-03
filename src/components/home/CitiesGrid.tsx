import Link from "next/link";

const cities = [
  { name: "Uberlândia", count: 24, delay: "0" },
  { name: "Uberaba", count: 12, delay: "100" },
  { name: "Ituiutaba", count: 8, delay: "200" },
  { name: "Araguari", count: 5, delay: "300" },
];

export default function CitiesGrid() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-6">
        <h2 className="font-outfit text-2xl font-bold text-white mb-8 text-center md:text-left">
          📍 Eventos por Cidade
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={`/eventos?cidade=${city.name.toLowerCase()}`}
              className="flex flex-col items-center justify-center p-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <span className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-1 group-hover:scale-110 transition-transform">
                {city.count}
              </span>
              <span className="text-white font-bold text-lg">{city.name}</span>
              <span className="text-blue-200 text-xs uppercase tracking-wider mt-1">
                Eventos
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
