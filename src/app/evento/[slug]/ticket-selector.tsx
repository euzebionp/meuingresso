"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface TicketType {
  id: string;
  name: string;
  price: number;
  batch: string;
  isAvailable: boolean;
}

interface TicketSelectorProps {
  eventId: string;
  eventName: string;
  tickets: TicketType[];
}

export default function TicketSelector({ eventId, eventName, tickets }: TicketSelectorProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Estado local para a seleção antes de adicionar ao carrinho
  const [selections, setSelections] = useState<Record<string, number>>({});

  const updateQuantity = (ticketId: string, delta: number) => {
    setSelections((prev) => {
      const current = prev[ticketId] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      if (next > 10) return prev; // max 10 por pessoa
      return { ...prev, [ticketId]: next };
    });
  };

  const totalSelected = Object.values(selections).reduce((sum, qty) => sum + qty, 0);
  const subtotal = tickets.reduce((sum, ticket) => {
    return sum + (selections[ticket.id] || 0) * ticket.price;
  }, 0);

  const handleBuy = () => {
    if (totalSelected === 0) return;

    tickets.forEach((ticket) => {
      const qty = selections[ticket.id];
      if (qty && qty > 0) {
        addToCart({
          eventId,
          eventName,
          ticketId: ticket.id,
          ticketName: `${ticket.name} - ${ticket.batch}`,
          price: ticket.price,
          quantity: qty,
        });
      }
    });

    router.push("/carrinho");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
      <h3 className="font-outfit text-xl font-bold text-gray-900 mb-4">Selecionar Ingresso</h3>
      
      <div className="space-y-3 mb-6">
        {tickets.map((ticket) => {
          const qty = selections[ticket.id] || 0;
          
          return (
            <div 
              key={ticket.id} 
              className={`flex flex-col border-2 rounded-xl p-3 transition-colors ${
                qty > 0 ? "border-blue-600 bg-blue-50/50" : "border-gray-100 hover:border-gray-200"
              } ${!ticket.isAvailable ? "opacity-50 pointer-events-none grayscale" : "cursor-pointer"}`}
              onClick={() => {
                if (ticket.isAvailable && qty === 0) updateQuantity(ticket.id, 1);
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <strong className="block text-gray-900 leading-tight">{ticket.name}</strong>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    ticket.isAvailable ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-600"
                  }`}>
                    {ticket.isAvailable ? ticket.batch : "Esgotado"}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                <span className="text-blue-600 font-bold text-lg">
                  R$ {ticket.price.toFixed(2).replace(".", ",")}
                </span>
                
                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    disabled={!ticket.isAvailable || qty === 0}
                    onClick={(e) => { e.stopPropagation(); updateQuantity(ticket.id, -1); }}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-900">
                    {qty}
                  </span>
                  <button 
                    disabled={!ticket.isAvailable || qty >= 10}
                    onClick={(e) => { e.stopPropagation(); updateQuantity(ticket.id, 1); }}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-xl">
        <span className="text-gray-600 font-medium">Subtotal:</span>
        <strong className="text-xl text-gray-900">
          R$ {subtotal.toFixed(2).replace(".", ",")}
        </strong>
      </div>

      <button 
        onClick={handleBuy}
        disabled={totalSelected === 0}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        Adicionar ao Carrinho
      </button>
      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
        🔒 Pagamento seguro via Pagar.me
      </p>
    </div>
  );
}
