"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function applyToBeOrganizer(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Você precisa estar logado para se cadastrar." };
  }

  const companyName = formData.get("companyName") as string;
  const document = formData.get("document") as string;
  const phone = formData.get("phone") as string;

  if (!companyName || !document || !phone) {
    return { error: "Preencha todos os campos obrigatórios." };
  }

  try {
    // Verifica se já tem aplicação
    const existing = await prisma.organizerApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      if (existing.status === "APPROVED") {
        return { error: "Sua conta já foi aprovada! Acesse o painel." };
      }
      return { error: "Você já enviou uma solicitação. Aguarde a análise." };
    }

    // Cria a solicitação
    await prisma.organizerApplication.create({
      data: {
        userId: session.user.id,
        companyName,
        document,
        phone,
      },
    });

    revalidatePath("/seja-organizador");
    return { success: true };
  } catch (error) {
    console.error("Erro ao solicitar conta de organizador:", error);
    return { error: "Erro interno. Tente novamente mais tarde." };
  }
}
