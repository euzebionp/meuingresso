import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroCarousel from "@/components/home/HeroCarousel";
import AgendaRapida from "@/components/home/AgendaRapida";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import EventCard from "@/components/events/EventCard";
import CitiesGrid from "@/components/home/CitiesGrid";
import OrganizerCTA from "@/components/home/OrganizerCTA";

export default async function HomePage() {
  let featuredEvents: any[] = [];
  
  try {
    // Tenta buscar eventos do banco
    const events = await prisma.event.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true, venue: true, tickets: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    // Formata os eventos do banco para os cards da home
    featuredEvents = events.map(e => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(e.startDate),
      location: `${e.venue.city} - ${e.venue.state}`,
      price: e.tickets.length > 0 ? Number(e.tickets[0].price) : 0,
      badge: e.isFeatured ? { text: "Destaque", type: "featured" as const } : undefined,
      category: { name: e.category.name, icon: e.category.icon || "🎵" },
      bgClass: "from-[#1a1a2e] via-violet-600 to-pink-500", // Background temporário para imagens
    }));
  } catch (error) {
    console.error("Erro ao carregar eventos do banco:", error);
    // Em caso de erro, featuredEvents continua vazio e o componente lida com isso
  }

  return (
    <main>
      <HeroCarousel />
      <AgendaRapida />
      <CategoriesGrid />
      
      {/* Featured Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-outfit text-2xl md:text-3xl font-bold text-gray-900">
              🔥 Destaques da Semana
            </h2>
            <Link href="/eventos" className="text-blue-600 font-semibold hover:underline text-sm md:text-base">
              Ver todos →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-4xl mb-4 block">🎟️</span>
                <h3 className="text-gray-900 font-bold mb-2">Nenhum evento no momento</h3>
                <p className="text-gray-500">Novos eventos serão anunciados em breve!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CitiesGrid />
      <OrganizerCTA />
    </main>
  );
}
