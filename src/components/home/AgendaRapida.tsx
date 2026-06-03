"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const filters = [
  { id: "hoje", label: "Hoje" },
  { id: "amanha", label: "Amanhã" },
  { id: "fds", label: "Este Fim de Semana" },
  { id: "semana", label: "Esta Semana" },
  { id: "mes", label: "Este Mês" },
];

export default function AgendaRapida() {
  const [active, setActive] = useState("hoje");

  return (
    <section className="bg-white border-b border-gray-200 py-3 overflow-x-auto no-scrollbar">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-2 min-w-max">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActive(filter.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-colors whitespace-nowrap",
                active === filter.id
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-transparent border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
