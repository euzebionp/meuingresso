import Link from "next/link";
import { Ticket } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-24 md:pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Ticket className="w-6 h-6 text-blue-500" />
              <span className="font-outfit text-xl font-bold text-white">
                Meu<strong className="text-blue-500">Ingresso</strong>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              A plataforma oficial de ingressos do Triângulo Mineiro.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-200 mb-4">Eventos</h4>
            <div className="flex flex-col gap-2">
              <Link href="/eventos?categoria=shows" className="text-gray-400 hover:text-white text-sm transition-colors">Shows</Link>
              <Link href="/eventos?categoria=festas" className="text-gray-400 hover:text-white text-sm transition-colors">Festas</Link>
              <Link href="/eventos?categoria=rodeios" className="text-gray-400 hover:text-white text-sm transition-colors">Rodeios</Link>
              <Link href="/eventos?categoria=teatro" className="text-gray-400 hover:text-white text-sm transition-colors">Teatro</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-200 mb-4">Cidades</h4>
            <div className="flex flex-col gap-2">
              <Link href="/eventos/uberlandia" className="text-gray-400 hover:text-white text-sm transition-colors">Uberlândia</Link>
              <Link href="/eventos/uberaba" className="text-gray-400 hover:text-white text-sm transition-colors">Uberaba</Link>
              <Link href="/eventos/ituiutaba" className="text-gray-400 hover:text-white text-sm transition-colors">Ituiutaba</Link>
              <Link href="/eventos/araguari" className="text-gray-400 hover:text-white text-sm transition-colors">Araguari</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-200 mb-4">Plataforma</h4>
            <div className="flex flex-col gap-2">
              <Link href="/seja-organizador" className="text-gray-400 hover:text-white text-sm transition-colors">Seja Organizador</Link>
              <Link href="/minha-conta" className="text-gray-400 hover:text-white text-sm transition-colors">Minha Conta</Link>
              <Link href="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">Termos de Uso</Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidade</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 MeuIngresso. Todos os direitos reservados.</p>
          <p>
            Pagamentos processados com segurança pelo <strong className="text-gray-300">Pagar.me</strong> 🔒
          </p>
        </div>
      </div>
    </footer>
  );
}
