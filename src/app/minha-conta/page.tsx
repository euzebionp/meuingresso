import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Ticket, Calendar, MapPin, CheckCircle2, Clock, ChevronRight, QrCode } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Meus Ingressos | MeuIngresso",
};

export default async function MinhaContaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/entrar?callbackUrl=/minha-conta");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      event: {
        include: { venue: true }
      },
      items: {
        include: { ticket: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="font-outfit text-3xl font-bold text-gray-900">Meus Ingressos</h1>
          <p className="text-gray-500 mt-1">Veja seu histórico de compras e acesse seus ingressos.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Você ainda não tem ingressos</h2>
            <p className="text-gray-500 mb-8">Seus ingressos aparecerão aqui assim que você realizar uma compra.</p>
            <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
              Explorar Eventos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Status Bar */}
                <div className={`px-6 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                  order.status === "CONFIRMED" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                }`}>
                  <div className="flex items-center gap-1.5">
                    {order.status === "CONFIRMED" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {order.status === "CONFIRMED" ? "Pagamento Aprovado" : "Aguardando Pagamento"}
                  </div>
                  <span>Pedido #{order.id.slice(-6).toUpperCase()}</span>
                </div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Event Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex flex-col items-center justify-center text-white shrink-0">
                          <span className="text-[10px] font-bold uppercase">
                            {new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(order.event.startDate)}
                          </span>
                          <span className="text-xl font-bold leading-none">
                            {new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(order.event.startDate)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                            {order.event.title}
                          </h3>
                          <div className="flex flex-col gap-1 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Intl.DateTimeFormat("pt-BR", { 
                                weekday: "long", 
                                hour: "2-digit", 
                                minute: "2-digit" 
                              }).format(order.event.startDate)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {order.event.venue.name} - {order.event.venue.city}, {order.event.venue.state}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tickets List */}
                    <div className="md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Seus Itens</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 font-medium">
                              {item.quantity}x {item.ticket.name}
                            </span>
                            <span className="text-gray-900 font-bold">
                              {formatCurrency(Number(item.unitPrice) * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Total Pago</span>
                        <span className="text-lg font-extrabold text-blue-600">
                          {formatCurrency(Number(order.totalAmount))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status === "CONFIRMED" && (
                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                      <button className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors">
                        <QrCode className="w-5 h-5" /> Ver QR Code
                      </button>
                      <button className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                        Enviar por E-mail
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
