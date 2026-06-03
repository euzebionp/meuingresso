import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TicketSelector from "./ticket-selector";
import { Calendar, MapPin, AlertTriangle, User } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Evento não encontrado" };
  return { title: `${event.title} | MeuIngresso` };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      venue: true,
      category: true,
      tickets: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
    },
  });

  if (!event) {
    // Mock de fallback temporário igual à página inicial caso banco esteja vazio
    // Apenas para não dar erro 404 durante o desenvolvimento sem seed
    if (process.env.NODE_ENV === "development") {
      return (
        <MockEventPage slug={slug} />
      );
    }
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Banner / Header */}
      <div 
        className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-[#1e3a5f] via-blue-600 to-orange-500 relative flex items-end"
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-6 relative z-10 pb-10">
          <span className="bg-white/20 text-white border border-white/30 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md mb-4 inline-block">
            {event.category.icon} {event.category.name}
          </span>
          <h1 className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Intl.DateTimeFormat("pt-BR", { 
                  weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' 
                }).format(event.startDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.venue.name}, {event.venue.city} - {event.venue.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{event.ageRating === 0 ? "Livre" : `+${event.ageRating} anos`}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Esquerda: Informações */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-4">Sobre o evento</h2>
              <div className="prose prose-blue max-w-none text-gray-600">
                {event.description ? (
                  <p className="whitespace-pre-wrap">{event.description}</p>
                ) : (
                  <p>Descrição não disponível para este evento.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-4">Local</h2>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{event.venue.name}</h3>
                  <p className="text-gray-500">{event.venue.address}</p>
                  <p className="text-gray-500">{event.venue.city} - {event.venue.state}, {event.venue.zipCode}</p>
                </div>
              </div>
              <div className="w-full h-48 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400">
                🗺️ Mapa interativo (Em breve)
              </div>
            </div>
          </div>

          {/* Direita: Ingressos */}
          <div className="lg:col-span-1">
            <TicketSelector 
              eventId={event.id}
              eventName={event.title}
              tickets={event.tickets.map(t => ({
                id: t.id,
                name: t.name,
                price: Number(t.price),
                batch: t.batchName || `${t.batchNumber}º Lote`,
                isAvailable: t.soldQty < t.totalQty,
              }))}
            />
          </div>

        </div>
      </div>
    </main>
  );
}

// === COMPONENTE MOCK TEMPORÁRIO PARA DESENVOLVIMENTO ===
// Usado enquanto o banco de dados não tem os eventos do protótipo
function MockEventPage({ slug }: { slug: string }) {
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-[#1e3a5f] via-blue-600 to-orange-500 relative flex items-end">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-6 relative z-10 pb-10">
          <span className="bg-white/20 text-white border border-white/30 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md mb-4 inline-block">
            🤠 Rodeio
          </span>
          <h1 className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Sexta, 20 Jun 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Parque de Exposições, Uberlândia - MG</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>+18 anos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-4">Sobre o evento</h2>
              <div className="prose prose-blue max-w-none text-gray-600">
                <p>O maior rodeio do Triângulo Mineiro retorna em 2026 com 3 dias repletos de adrenalina, shows nacionais e muita festa. Artistas confirmados: Israel & Rodolffo, Luan Santana e Gusttavo Lima.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-4">Atrações</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><User className="w-5 h-5 text-gray-400" /> 🎵 Israel & Rodolffo — Sexta, 20/06 às 22h</li>
                <li className="flex items-center gap-3"><User className="w-5 h-5 text-gray-400" /> 🎵 Luan Santana — Sábado, 21/06 às 21h</li>
                <li className="flex items-center gap-3"><User className="w-5 h-5 text-gray-400" /> 🎵 Gusttavo Lima — Domingo, 22/06 às 20h</li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-1">
            <TicketSelector 
              eventId={`mock-${slug}`}
              eventName={title}
              tickets={[
                { id: "t1", name: "Pista", price: 45.0, batch: "1º Lote", isAvailable: true },
                { id: "t2", name: "VIP", price: 120.0, batch: "1º Lote", isAvailable: false },
                { id: "t3", name: "Camarote", price: 250.0, batch: "Disponível", isAvailable: true },
              ]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
