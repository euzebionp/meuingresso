"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "Rodeio do Triângulo 2026",
    desc: "O maior rodeio do Triângulo Mineiro — 3 dias de festa, shows e muita adrenalina",
    meta: "📅 20–22 Jun · Uberlândia | 💰 A partir de R$ 45",
    badge: "🔥 Em destaque",
    slug: "rodeio-do-triangulo-2026",
    bgClass: "from-[#1e3a5f] via-blue-600 to-orange-500",
  },
  {
    id: 2,
    title: "Wesley Safadão — Uberlândia",
    desc: "Uma noite inesquecível com o rei do forró no Parque de Exposições",
    meta: "📅 15 Jul · Uberlândia | 💰 A partir de R$ 80",
    badge: "⭐ Novo",
    slug: "wesley-safadao-uberlandia",
    bgClass: "from-[#1a1a2e] via-violet-600 to-pink-500",
  },
  {
    id: 3,
    title: "Balada UFU — Festa Junina Edition",
    desc: "A maior festa universitária de Uberlândia está de volta com tudo",
    meta: "📅 28 Jun · Uberlândia | 💰 A partir de R$ 25",
    badge: "🎓 Universitário",
    slug: "balada-ufu-festa-junina",
    bgClass: "from-[#0f4c25] via-emerald-500 to-amber-500",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[480px] overflow-hidden group">
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className={cn(
              "flex-shrink-0 w-full h-full flex items-center justify-center p-8 bg-gradient-to-br",
              slide.bgClass
            )}
          >
            <div className="max-w-2xl mx-auto text-center text-white">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold border border-white/40 bg-white/20 rounded-full backdrop-blur-sm">
                {slide.badge}
              </span>
              <h1 className="font-outfit text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow">
                {slide.desc}
              </p>
              <p className="text-sm md:text-base text-white/80 mb-8 font-medium">
                {slide.meta}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link 
                  href={`/evento/${slide.slug}`}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all transform hover:-translate-y-0.5"
                >
                  Comprar Ingresso
                </Link>
                <Link 
                  href={`/evento/${slide.slug}`}
                  className="bg-white/15 hover:bg-white/25 border-2 border-white/50 text-white font-semibold py-2.5 px-6 rounded-full backdrop-blur-md transition-all"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              current === i ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </section>
  );
}
