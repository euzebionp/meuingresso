import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, TrendingUp, Users, Ticket, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Painel Organizador | MeuIngresso",
};

export default async function PainelDashboard() {
  const session = await auth();

  // Busca estatísticas básicas do organizador
  const eventsCount = await prisma.event.count({
    where: { producerId: session?.user?.id },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Resumo/Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Eventos Ativos</span>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <CalendarDaysIcon className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-outfit font-bold text-gray-900">{eventsCount}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Ingressos Vendidos</span>
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-outfit font-bold text-gray-900">0</span>
          <span className="text-xs text-gray-400 mt-2">Neste mês</span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Receita Bruta</span>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-outfit font-bold text-gray-900">R$ 0,00</span>
          <span className="text-xs text-gray-400 mt-2">Neste mês</span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Visitas na Página</span>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-outfit font-bold text-gray-900">0</span>
          <span className="text-xs text-gray-400 mt-2">Últimos 7 dias</span>
        </div>
      </div>

      {/* Ações Rápidas & Aviso */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-outfit font-bold text-xl text-gray-900">Eventos Recentes</h3>
              <Link href="/painel/eventos/novo" className="flex items-center gap-2 text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <PlusCircle className="w-4 h-4" /> Novo Evento
              </Link>
            </div>
            
            {eventsCount === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-1">Nenhum evento criado</h4>
                <p className="text-sm text-gray-500 mb-6">Crie seu primeiro evento para começar a vender ingressos.</p>
                <Link href="/painel/eventos/novo" className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Criar Evento
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Lista de eventos aparecerá aqui...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <div className="flex gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <h3 className="font-semibold text-orange-900">Configure seus pagamentos</h3>
            </div>
            <p className="text-sm text-orange-800 mb-4">
              Para começar a vender, você precisa conectar sua conta do <strong>Pagar.me</strong> para receber os valores das vendas.
            </p>
            <Link href="/painel/configuracoes/pagamentos" className="inline-block bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Configurar agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini Componente de Ícone para evitar importações muito longas
function CalendarDaysIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
