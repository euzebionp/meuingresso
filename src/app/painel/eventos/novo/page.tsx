"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEventAction } from "@/app/actions/events";
import { ArrowLeft, Save, MapPin, Ticket, CalendarDays, Info } from "lucide-react";
import Link from "next/link";

export default function NovoEventoPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const res = await createEventAction(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success && res.eventSlug) {
        router.push(`/evento/${res.eventSlug}`);
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/painel" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <div>
          <h1 className="font-outfit text-3xl font-bold text-gray-900">Criar Novo Evento</h1>
          <p className="text-gray-500 text-sm mt-1">Preencha os detalhes para publicar seu evento.</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Bloco 1: Informações Básicas */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Informações Básicas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Nome do Evento *</label>
              <input type="text" name="title" required placeholder="Ex: Festival de Verão 2026" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Categoria *</label>
              <input type="text" name="categoryName" required placeholder="Ex: Show, Rodeio, Teatro..." className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Classificação Indicativa</label>
              <select name="ageRating" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-white">
                <option value="0">Livre</option>
                <option value="12">+12 anos</option>
                <option value="14">+14 anos</option>
                <option value="16">+16 anos</option>
                <option value="18">+18 anos</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Data e Hora *</label>
              <input type="datetime-local" name="startDate" required className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Descrição do Evento</label>
              <textarea name="description" rows={4} placeholder="Conte sobre o evento, atrações, avisos importantes..." className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Bloco 2: Local */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">Localização</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Nome do Local *</label>
              <input type="text" name="venueName" required placeholder="Ex: Parque de Exposições Camaru" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Endereço Completo</label>
              <input type="text" name="venueAddress" placeholder="Ex: Av. Juracy, 1000 - Pampulha" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Cidade *</label>
              <input type="text" name="venueCity" required placeholder="Ex: Uberlândia" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Estado *</label>
              <select name="venueState" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-white">
                <option value="MG">Minas Gerais</option>
                <option value="SP">São Paulo</option>
                <option value="GO">Goiás</option>
                <option value="DF">Distrito Federal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bloco 3: Ingressos */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <Ticket className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-bold text-gray-900">Ingressos (1º Lote)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-sm font-semibold text-gray-700">Nome do Ingresso *</label>
              <input type="text" name="ticketName" required placeholder="Ex: Pista Inteira" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-sm font-semibold text-gray-700">Valor (R$) *</label>
              <input type="number" step="0.01" name="ticketPrice" required placeholder="0.00" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-sm font-semibold text-gray-700">Quantidade Disponível *</label>
              <input type="number" name="ticketQty" required placeholder="100" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            * Este será o seu primeiro tipo de ingresso. Você poderá adicionar mais ingressos (VIP, Camarote) editando o evento depois.
          </p>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <Link href="/painel" className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancelar
          </Link>
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-70 transition-all shadow-md hover:-translate-y-0.5"
          >
            {isPending ? "Salvando..." : (
              <>
                <Save className="w-5 h-5" /> Salvar e Publicar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
