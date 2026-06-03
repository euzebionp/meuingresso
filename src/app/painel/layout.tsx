import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Ticket, LayoutDashboard, CalendarDays, Users, Settings, LogOut } from "lucide-react";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/entrar");
  }

  // Verifica se o usuário é organizador aprovado ou ADMIN
  if (session.user.role !== "ADMIN" && session.user.role !== "PRODUCER") {
    // Tenta buscar se a aplicação foi aprovada e o role não atualizou no cookie
    const application = await prisma.organizerApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (application?.status === "APPROVED") {
      // Atualiza o role do usuário no banco (caso alguém tenha aprovado direto no banco)
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "PRODUCER" },
      });
      // O token vai atualizar no próximo request
    } else {
      // Redireciona para acompanhamento
      redirect("/seja-organizador");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex-shrink-0 md:min-h-screen">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <Ticket className="w-6 h-6 text-orange-500" />
            <span className="font-outfit text-xl font-bold">
              Painel <strong className="text-orange-500">PRO</strong>
            </span>
          </Link>
        </div>
        <nav className="p-4 flex gap-2 md:flex-col overflow-x-auto no-scrollbar">
          <Link href="/painel" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors whitespace-nowrap">
            <LayoutDashboard className="w-5 h-5" /> Início
          </Link>
          <Link href="/painel/eventos" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 font-medium hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap">
            <CalendarDays className="w-5 h-5" /> Meus Eventos
          </Link>
          <Link href="/painel/vendas" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 font-medium hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap">
            <Ticket className="w-5 h-5" /> Vendas
          </Link>
          <Link href="/painel/equipe" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 font-medium hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap">
            <Users className="w-5 h-5" /> Equipe
          </Link>
          <div className="mt-auto hidden md:block pt-8">
            <Link href="/painel/configuracoes" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 font-medium hover:bg-white/10 hover:text-white transition-colors">
              <Settings className="w-5 h-5" /> Configurações
            </Link>
            <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 font-medium hover:bg-red-500/10 hover:text-red-300 transition-colors mt-2">
              <LogOut className="w-5 h-5" /> Sair
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-8 flex justify-between items-center">
          <h2 className="font-outfit text-xl font-bold text-gray-800">
            Produtor
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 hidden sm:inline-block">
              {session.user.name}
            </span>
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center text-blue-700 font-bold">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
