"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGARME_API_URL = process.env.PAGARME_API_URL || "https://api.pagar.me/core/v5";
const PAGARME_SECRET_KEY = process.env.PAGARME_SECRET_KEY;

export async function createPixOrder(data: {
  amount: number;
  serviceFee: number;
  items: { id: string; title: string; unit_price: number; quantity: number }[];
  customer: { name: string; email: string; document: string };
  eventId: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Usuário não autenticado." };
  }

  try {
    // 1. Criar o pedido no Pagar.me
    const basicAuth = Buffer.from(`${PAGARME_SECRET_KEY}:`).toString("base64");
    
    // Valor no Pagar.me é em centavos
    const amountInCents = Math.round(data.amount * 100);
    
    const payload = {
      items: data.items.map(item => ({
        amount: Math.round(item.unit_price * 100),
        description: item.title.substring(0, 255), // Limite do pagarme
        quantity: item.quantity,
        code: item.id
      })),
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        document: data.customer.document.replace(/\D/g, ""), // Limpa pontuação do CPF
        type: "individual",
        phones: {
          mobile_phone: {
            country_code: "55",
            area_code: "34", // Mock
            number: "999999999" // Mock
          }
        }
      },
      payments: [
        {
          payment_method: "pix",
          pix: {
            expires_in: 900 // 15 minutos
          }
        }
      ]
    };

    const response = await fetch(`${PAGARME_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Erro Pagar.me:", result);
      return { error: "Falha ao processar pagamento com a operadora." };
    }

    const qrCode = result.charges[0].last_transaction.qr_code;
    const qrCodeUrl = result.charges[0].last_transaction.qr_code_url;
    const pagarmeOrderId = result.id;

    // 2. Salvar no nosso banco de dados (Prisma)
    await prisma.order.create({
      data: {
        id: pagarmeOrderId, // Usamos o mesmo ID ou criamos um relacionamento
        userId: session.user.id,
        eventId: data.eventId,
        totalAmount: data.amount,
        serviceFee: data.serviceFee,
        status: "PENDING",
        paymentMethod: "PIX",
        items: {
          create: data.items.map(item => ({
            ticketId: item.id,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            holderCpf: data.customer.document
          }))
        }
      }
    });

    return {
      success: true,
      qrCode,
      qrCodeUrl,
      orderId: pagarmeOrderId
    };

  } catch (error: any) {
    console.error("Erro no checkout Pix:", error);
    return { error: `Erro interno: ${error.message || "Desconhecido"}` };
  }
}

export async function simulatePaymentApproval(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return { error: "Pedido não encontrado." };

    // Atualiza status do pedido
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED" }
    });

    // Atualiza quantidade vendida dos lotes
    for (const item of order.items) {
      await prisma.ticket.update({
        where: { id: item.ticketId },
        data: {
          soldQty: {
            increment: item.quantity
          }
        }
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao simular pagamento:", error);
    return { error: "Erro interno ao simular." };
  }
}
