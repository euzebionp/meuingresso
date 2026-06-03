import Link from "next/link";

const categories = [
  { slug: "shows", label: "Shows", icon: "🎵" },
  { slug: "festas", label: "Festas", icon: "🎉" },
  { slug: "rodeios", label: "Rodeios", icon: "🤠" },
  { slug: "teatro", label: "Teatro", icon: "🎭" },
  { slug: "stand-up", label: "Stand-up", icon: "😂" },
  { slug: "esportes", label: "Esportes", icon: "⚽" },
  { slug: "universitario", label: "Universitário", icon: "🎓" },
  { slug: "infantil", label: "Infantil", icon: "👶" },
];

export default function CategoriesGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-6">
          Explorar por categoria
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/eventos?categoria=${cat.slug}`}
              className="flex flex-col items-center gap-2 bg-white border-2 border-gray-100 rounded-xl p-4 transition-all hover:border-blue-600 hover:bg-blue-50 group"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">
                {cat.icon}
              </span>
              <span className="text-xs font-semibold text-gray-500 group-hover:text-blue-600">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
