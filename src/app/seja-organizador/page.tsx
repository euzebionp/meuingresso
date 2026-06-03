import { auth } from "@/lib/auth";
import OrganizerForm from "./organizer-form";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, LayoutDashboard } from "lucide-react";

export const metadata = {
  title: "Seja Organizador | MeuIngresso",
  description: "Crie e venda ingressos para seus eventos com total controle.",
};

export default async function SejaOrganizadorPage() {
  const session = await auth();

  // Verifica status da aplicação se logado
  let appStatus = null;
  if (session?.user?.id) {
    const application = await prisma.organizerApplication.findUnique({
      where: { userId: session.user.id },
    });
    if (application) {
      appStatus = application.status;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        
        {/* Lado Esquerdo - Info */}
        <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-600 p-10 lg:p-16 flex flex-col justify-center text-white">
          <span className="text-4xl mb-4">🎛️</span>
          <h1 className="font-outfit text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
            Venda mais com a nossa plataforma
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Tenha total controle sobre seus eventos, ingressos e relatórios de vendas. Sem mensalidade, você só paga uma pequena taxa quando vender.
          </p>
          <ul className="space-y-4 font-medium text-blue-50">
            <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400 w-6 h-6"/> Saques diários via Pix</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400 w-6 h-6"/> Aceite Pix, Cartão e Boleto</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400 w-6 h-6"/> App de Check-in (QR Code)</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400 w-6 h-6"/> Dashboard em tempo real</li>
          </ul>
        </div>

        {/* Lado Direito - Formulário ou Status */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          {!session ? (
            <div className="text-center">
              <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-2">Primeiro passo</h2>
              <p className="text-gray-500 mb-8">Para ser um organizador, você precisa primeiro criar uma conta na plataforma ou fazer login.</p>
              <Link href="/entrar" className="inline-block w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition-colors">
                Fazer Login / Cadastrar
              </Link>
            </div>
          ) : appStatus === "APPROVED" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-2">Você já é organizador!</h2>
              <p className="text-gray-500 mb-8">Sua conta já possui permissão de produtor. Acesse o painel para gerenciar seus eventos.</p>
              <Link href="/painel" className="inline-block w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition-colors">
                Acessar Painel
              </Link>
            </div>
          ) : appStatus === "PENDING" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⏳</span>
              </div>
              <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-2">Em Análise</h2>
              <p className="text-gray-500 mb-8">Recebemos sua solicitação. Nossa equipe está analisando seus dados e em breve você terá uma resposta (até 24h úteis).</p>
            </div>
          ) : appStatus === "REJECTED" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">❌</span>
              </div>
              <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-2">Solicitação Recusada</h2>
              <p className="text-gray-500 mb-8">Infelizmente não pudemos aprovar sua conta de organizador neste momento. Entre em contato com o suporte para mais informações.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-1">Preencha seus dados</h2>
                <p className="text-sm text-gray-500">Logado como: <strong>{session.user?.email}</strong></p>
              </div>
              <OrganizerForm />
            </>
          )}
        </div>

      </div>
    </main>
  );
}
