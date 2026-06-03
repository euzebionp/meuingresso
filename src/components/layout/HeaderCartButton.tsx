"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function HeaderCartButton() {
  const { totalItems } = useCart();

  return (
    <Link href="/carrinho" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
      <ShoppingCart className="w-6 h-6 text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
