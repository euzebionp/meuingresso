"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: {
    title: string;
    slug: string;
    date: string;
    location: string;
    price: number;
    badge?: { text: string; type: "urgent" | "new" | "featured" };
    category: { name: string; icon?: string };
    bgClass: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const [isFav, setIsFav] = useState(false);

  return (
    <Link 
      href={`/evento/${event.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      {/* Imagem / Capa */}
      <div className={cn("relative h-44 p-3 flex flex-col justify-between bg-gradient-to-br", event.bgClass)}>
        <div className="flex justify-between items-start">
          <span className="bg-black/40 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
            {event.category.icon} {event.category.name}
          </span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsFav(!isFav);
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <Heart 
              className={cn("w-4 h-4 transition-colors", isFav ? "fill-red-500 text-red-500" : "text-white")} 
            />
          </button>
        </div>

        {event.badge && (
          <div className="flex justify-end">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white",
              event.badge.type === "urgent" ? "bg-red-500 animate-pulse" :
              event.badge.type === "new" ? "bg-green-500" :
              "bg-orange-500"
            )}>
              {event.badge.text}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-outfit font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="flex flex-col gap-1 mb-4 mt-auto">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            📅 {event.date}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            📍 {event.location}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">A partir de</span>
            <strong className="text-blue-600 font-bold">R$ {event.price.toFixed(2).replace('.', ',')}</strong>
          </div>
          <button className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors">
            Comprar
          </button>
        </div>
      </div>
    </Link>
  );
}
