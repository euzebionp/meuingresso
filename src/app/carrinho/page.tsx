"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Ticket, Trash2, Clock, CheckCircle2, Copy, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateServiceFee, formatCurrency } from "@/lib/utils";
import { createPixOrder, simulatePaymentApproval } from "@/app/actions/checkout";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, subtotal } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");
  
  // Payment states
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeUrl: string; orderId: string } | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Taxa de serviço (ex: 10%)
  const serviceFee = items.reduce((sum, item) => sum + calculateServiceFee(item.price * item.quantity), 0);
  const total = subtotal + serviceFee;

  useEffect(() => {
    if (totalItems === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Opcional: limpar carrinho aqui
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalItems]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleProceedToPayment = () => {
    if (status === "unauthenticated") {
      router.push("/entrar?callbackUrl=/carrinho");
      return;
    }
    setStep(2);
  };

  const handleConfirmId = () => {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      setCpfError("CPF inválido. Digite os 11 números.");
      return;
    }
    setCpfError("");
    setStep(3);
  };

  const handleGeneratePix = async () => {
    setIsProcessing(true);
    setPaymentError("");

    const response = await createPixOrder({
      amount: total,
      serviceFee: serviceFee,
      items: items.map(item => ({
        id: item.ticketId,
        title: item.ticketName,
        unit_price: item.price,
        quantity: item.quantity
      })),
      customer: {
        name: session?.user?.name || "Cliente Padrão",
        email: session?.user?.email || "cliente@teste.com",
        document: cpf
      },
      eventId: items[0].eventId // Assume que os itens são do mesmo evento
    });

    setIsProcessing(false);

    if (response.error) {
      setPaymentError(response.error);
    } else if (response.qrCode && response.orderId) {
      setPixData({ qrCode: response.qrCode, qrCodeUrl: response.qrCodeUrl, orderId: response.orderId });
    }
  };

  const handleSimulatePayment = async () => {
    if (!pixData?.orderId) return;
    setIsProcessing(true);
    const res = await simulatePaymentApproval(pixData.orderId);
    setIsProcessing(false);
    
    if (res.success) {
      setPaymentSuccess(true);
      clearCart();
    } else {
      setPaymentError("Erro ao simular pagamento.");
    }
  };

  const copyPixCode = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      alert("Código PIX copiado!");
    }
  };

  if (totalItems === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8">Navegue pelos eventos e adicione ingressos para comprar.</p>
          <Link href="/" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
            Explorar Eventos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="font-outfit text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        {/* Steps indicator */}
        <div className="flex items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
          <div className={`flex items-center gap-2 font-semibold ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full bg-current text-white flex items-center justify-center text-xs">1</span>
            Carrinho
          </div>
          <div className={`w-8 h-px mx-4 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          <div className={`flex items-center gap-2 font-semibold ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full bg-current text-white flex items-center justify-center text-xs">2</span>
            Identificação
          </div>
          <div className={`w-8 h-px mx-4 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          <div className={`flex items-center gap-2 font-semibold ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full bg-current text-white flex items-center justify-center text-xs">3</span>
            Pagamento
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Seus Ingressos</h2>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.ticketId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div>
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                          {item.eventName}
                        </span>
                        <strong className="block text-gray-900 text-lg">{item.ticketName}</strong>
                        <span className="text-gray-500 font-medium">{formatCurrency(item.price)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.ticketId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200">-</button>
                          <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.ticketId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200">+</button>
                        </div>
                        <strong className="text-gray-900 min-w-[80px] text-right">
                          {formatCurrency(item.price * item.quantity)}
                        </strong>
                        <button onClick={() => removeFromCart(item.ticketId)} className="text-red-400 hover:text-red-600 p-2">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Identificação</h2>
                  <button onClick={() => setStep(1)} className="text-sm text-blue-600 font-semibold hover:underline">Voltar</button>
                </div>
                
                {status === "authenticated" ? (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-green-900">Você está logado</h3>
                        <p className="text-green-800 text-sm mt-1">
                          Comprando como: <strong>{session.user?.name} ({session.user?.email})</strong>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <label className="block text-sm font-semibold text-green-900 mb-2">
                        Confirme seu CPF
                      </label>
                      <input 
                        type="text" 
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="Apenas números"
                        className="w-full max-w-sm px-4 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        maxLength={14}
                      />
                      {cpfError && <p className="text-red-500 text-sm mt-1">{cpfError}</p>}
                      <button 
                        onClick={handleConfirmId} 
                        className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors block"
                      >
                        Continuar para Pagamento
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Você precisa estar logado para continuar.</p>
                    <button onClick={handleProceedToPayment} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
                      Fazer Login
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Forma de Pagamento</h2>
                  <button onClick={() => setStep(2)} className="text-sm text-blue-600 font-semibold hover:underline">Voltar</button>
                </div>
                
                {paymentSuccess ? (
                  <div className="text-center animate-in fade-in py-12">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Aprovado! 🎉</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Seus ingressos já foram gerados e enviados para o seu e-mail. Você também pode visualizá-los diretamente no painel.
                    </p>
                    <Link href="/minha-conta" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors inline-block">
                      Ver Meus Ingressos
                    </Link>
                  </div>
                ) : pixData ? (
                  <div className="text-center animate-in fade-in">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pedido Gerado!</h3>
                    <p className="text-gray-600 mb-8">Escaneie o QR Code abaixo para pagar via PIX.</p>
                    
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 mx-auto max-w-xs mb-6 relative">
                      {/* Placeholder de imagem. Numa env real o pagarme manda o base64 ou URL */}
                      <img src={pixData.qrCodeUrl} alt="QR Code PIX" className="mx-auto w-full max-w-[200px] mb-4 mix-blend-multiply" />
                      <button 
                        onClick={copyPixCode}
                        className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" /> Copiar Código Pix
                      </button>
                    </div>
                    
                    {/* Botão mágico de teste local */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-bold">Apenas para Testes Locais</p>
                      <button 
                        onClick={handleSimulatePayment}
                        disabled={isProcessing}
                        className="mx-auto flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-2 px-6 rounded-full transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                        Simular Pagamento Aprovado
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center max-w-md mx-auto">
                    <span className="text-4xl mb-4 block">📱</span>
                    <h3 className="font-bold text-gray-900 mb-2">Pagar com PIX</h3>
                    <p className="text-gray-500 mb-6 text-sm">
                      Aprovação imediata. O ingresso é liberado na mesma hora.
                    </p>
                    
                    {paymentError && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-4">
                        {paymentError}
                      </div>
                    )}

                    <button 
                      onClick={handleGeneratePix}
                      disabled={isProcessing}
                      className="w-full bg-[#00B4D8] hover:bg-[#0096C7] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {isProcessing ? "Gerando PIX..." : "Gerar QR Code PIX"}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Resumo Lateral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-outfit text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Ingressos ({totalItems})</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de serviço (10%)</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-gray-900 font-bold">Total</span>
                <strong className="text-2xl font-extrabold text-blue-600 leading-none">
                  {formatCurrency(total)}
                </strong>
              </div>

              {step === 1 && (
                <button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold bg-orange-50 text-orange-600 p-3 rounded-lg border border-orange-100">
                <Clock className="w-4 h-4" />
                Reserva expira em {formatTime(timeLeft)}
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-[11px] text-gray-400">
                  Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
