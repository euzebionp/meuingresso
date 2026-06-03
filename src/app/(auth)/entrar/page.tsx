import Link from "next/link";
import { Ticket } from "lucide-react";
import LoginForm from "./login-form";

export default function LoginPage() {
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
          <h1 className="font-outfit text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-500 text-sm text-center">
            Acesse sua conta para comprar ingressos ou gerenciar seus eventos.
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 text-center text-sm text-gray-500">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-blue-600 font-semibold hover:underline">
            Cadastre-se grátis
          </Link>
        </div>
      </div>
    </div>
  );
}
