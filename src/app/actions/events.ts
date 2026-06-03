"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEventAction(formData: FormData) {
  const session = await auth();

  // Apenas ADMIN ou PRODUCER podem criar eventos
  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "PRODUCER")) {
    return { error: "Sem permissão para criar eventos." };
  }

  // Coleta dados básicos do evento
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const categoryName = formData.get("categoryName") as string;
  const startDateStr = formData.get("startDate") as string;
  const ageRatingStr = formData.get("ageRating") as string;
  
  // Coleta dados do Local (Venue)
  const venueName = formData.get("venueName") as string;
  const venueAddress = formData.get("venueAddress") as string;
  const venueCity = formData.get("venueCity") as string;
  const venueState = formData.get("venueState") as string;
  const venueZip = formData.get("venueZip") as string;

  // Coleta dados do Ingresso
  const ticketName = formData.get("ticketName") as string;
  const ticketPrice = parseFloat(formData.get("ticketPrice") as string);
  const ticketQty = parseInt(formData.get("ticketQty") as string, 10);

  if (!title || !startDateStr || !venueName || !ticketName) {
    return { error: "Preencha todos os campos obrigatórios." };
  }

  try {
    // 1. Resolve a Categoria (Garante que ela existe)
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: {
        name: categoryName,
        slug: categorySlug,
        icon: "🎟️",
      },
    });

    // 2. Cria o Local (Venue)
    const venue = await prisma.venue.create({
      data: {
        name: venueName,
        address: venueAddress || "TBD",
        city: venueCity || "TBD",
        state: venueState || "MG",
        zipCode: venueZip || "00000-000",
      },
    });

    // 3. Cria o Evento
    const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniqueSlug = `${slugBase}-${Date.now().toString().slice(-4)}`;
    
    const event = await prisma.event.create({
      data: {
        title,
        slug: uniqueSlug,
        description,
        startDate: new Date(startDateStr),
        endDate: new Date(startDateStr), // Simplificação para o MVP
        ageRating: parseInt(ageRatingStr || "0", 10),
        status: "PUBLISHED", // Já publica direto para facilitar testes
        categoryId: category.id,
        venueId: venue.id,
        producerId: session.user.id,
        // Cria o lote inicial de ingressos junto com o evento
        tickets: {
          create: {
            name: ticketName,
            description: "Acesso Padrão",
            price: ticketPrice,
            totalQty: ticketQty,
            batchNumber: 1,
            batchName: "1º Lote",
            isActive: true,
          }
        }
      },
    });

    revalidatePath("/");
    revalidatePath("/painel/eventos");
    
    return { success: true, eventSlug: event.slug };
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return { error: "Erro interno ao salvar evento." };
  }
}
