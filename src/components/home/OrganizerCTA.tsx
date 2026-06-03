import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function OrganizerCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-outfit text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Você é organizador de eventos?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
              Cadastre seu evento gratuitamente e venda ingressos online com total controle pelo nosso painel exclusivo.
            </p>
            
            <ul className="space-y-4 mb-8 text-left max-w-sm mx-auto md:mx-0">
              {[
                "Crie e gerencie seus eventos",
                "Venda via Pix, Boleto e Cartão",
                "Painel de vendas em tempo real",
                "Check-in ágil por QR Code",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto text-center">
            <Link 
              href="/seja-organizador"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-4 px-10 rounded-full shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-1 w-full md:w-auto"
            >
              Cadastrar meu evento
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-gray-500 mt-4 font-medium">
              Aprovação em até 24h úteis • Sem mensalidade
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
