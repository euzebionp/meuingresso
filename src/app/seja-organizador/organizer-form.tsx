"use client";

import { useState, useTransition } from "react";
import { applyToBeOrganizer } from "@/app/actions/organizer";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OrganizerForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await applyToBeOrganizer(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-outfit text-2xl font-bold text-gray-900 mb-2">
          Cadastro Enviado!
        </h3>
        <p className="text-gray-600 mb-8">
          Sua solicitação foi recebida e será analisada pela nossa equipe em até 24 horas úteis.
        </p>
        <Link 
          href="/"
          className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-colors"
        >
          Voltar para Início
        </Link>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Nome ou Razão Social</label>
        <input
          type="text"
          name="companyName"
          required
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
          placeholder="Ex: Produtora XYZ"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">CPF ou CNPJ</label>
        <input
          type="text"
          name="document"
          required
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
          placeholder="Apenas números"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">WhatsApp para Contato</label>
        <input
          type="tel"
          name="phone"
          required
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
          placeholder="(34) 99999-9999"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 mt-4 text-lg shadow-md"
      >
        {isPending ? "Enviando..." : "Enviar Solicitação"}
      </button>

      <p className="text-xs text-center text-gray-500 mt-2">
        Aprovação em até 24h úteis. Ao enviar, você concorda com nossos Termos de Uso.
      </p>
    </form>
  );
}
