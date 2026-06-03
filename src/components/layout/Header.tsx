import Link from "next/link";
import { Search, MapPin, ShoppingCart, Ticket } from "lucide-react";
import { auth } from "@/lib/auth";
import { HeaderCartButton } from "./HeaderCartButton";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 py-3">
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Ticket className="w-6 h-6 text-blue-600" />
          <span className="font-outfit text-xl font-bold text-gray-900">
            Meu<strong className="text-blue-600">Ingresso</strong>
          </span>
        </Link>
        
        {/* Search Bar (Hidden on Mobile) */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 focus-within:border-blue-600 focus-within:bg-white transition-colors">
          <Search className="w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar eventos, artistas ou locais..." 
            className="bg-transparent border-none outline-none flex-1 text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* City Selector */}
          <button className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-sm hover:bg-blue-50 hover:border-blue-600 transition-colors">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Uberlândia</span>
          </button>
          
          <HeaderCartButton />

          {/* User Auth */}
          {session ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/minha-conta" className="font-semibold text-sm text-gray-700 hover:text-blue-600">
                Minha Conta
              </Link>
              {(session.user?.role === "ADMIN" || session.user?.role === "PRODUCER") && (
                <Link href="/painel" className="font-semibold text-sm text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                  Painel Pro
                </Link>
              )}
            </div>
          ) : (
            <Link href="/entrar" className="hidden md:block border-2 border-blue-600 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors">
              Entrar
            </Link>
          )}

          {/* Organizer CTA */}
          <Link href="/seja-organizador" className="hidden lg:block bg-blue-600 text-white rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-blue-700 transition-colors">
            Seja Organizador
          </Link>
        </div>
      </div>
    </header>
  );
}
