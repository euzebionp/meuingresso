"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/busca", label: "Buscar", icon: Search },
    { href: "/carrinho", label: "Carrinho", icon: ShoppingCart },
    { href: "/minha-conta", label: "Conta", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 px-2 flex-1 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {item.href === "/carrinho" && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
