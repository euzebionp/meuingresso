import Link from "next/link";
import { Ticket } from "lucide-react";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Ticket className="w-8 h-8 text-blue-600" />
            <span className="font-outfit text-2xl font-bold text-gray-900">
              Meu<strong className="text-blue-600">Ingresso</strong>
            </span>
          </Link>
          <h1 className="font-outfit text-2xl font-bold text-gray-900 mb-2">Criar conta</h1>
          <p className="text-gray-500 text-sm text-center">
            Cadastre-se para comprar ingressos de forma rápida e segura.
          </p>
        </div>

        <RegisterForm />

        <div className="mt-8 text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <Link href="/entrar" className="text-blue-600 font-semibold hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
