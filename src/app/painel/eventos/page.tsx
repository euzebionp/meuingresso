import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, MapPin, CalendarDays, Ticket, MoreVertical, Search, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Meus Eventos | Painel",
};

export default async function MeusEventosPage() {
  const session = await auth();

  // Busca eventos do organizador
  const events = await prisma.event.findMany({
    where: { producerId: session?.user?.id },
    include: {
      venue: true,
      _count: {
        select: { tickets: true, orders: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-outfit text-2xl font-bold text-gray-900">Meus Eventos</h1>
          <p className="text-gray-500 text-sm">Gerencie seus eventos e acompanhe as vendas.</p>
        </div>
        
        <Link href="/painel/eventos/novo" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <PlusCircle className="w-5 h-5" /> Novo Evento
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar evento..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600">
            <option value="all">Todos os status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="past">Passados</option>
          </select>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">Nenhum evento encontrado</h3>
            <p className="text-sm text-gray-500 mb-6">Você ainda não tem eventos criados ou publicados.</p>
            <Link href="/painel/eventos/novo" className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Criar meu primeiro evento
            </Link>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              {/* Banner Placeholder */}
              <div className="h-32 bg-gradient-to-br from-[#1e3a5f] to-blue-600 relative">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md text-blue-800 shadow-sm">
                  {event.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                </div>
              </div>
              
              {/* Info */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Intl.DateTimeFormat("pt-BR", { 
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      }).format(event.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 line-clamp-1">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{event.venue.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                    <Ticket className="w-4 h-4" />
                    {event._count.orders} vendidos
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/evento/${event.slug}`} 
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver página do evento"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
