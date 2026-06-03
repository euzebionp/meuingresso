import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "MeuIngresso — Ingressos para Shows, Festas e Eventos no Triângulo Mineiro",
    template: "%s | MeuIngresso",
  },
  description:
    "Compre ingressos para shows, festas, rodeios e eventos no Triângulo Mineiro. Uberlândia, Uberaba, Ituiutaba e região. Pagamento via Pix, Cartão e Boleto.",
  keywords: ["ingressos", "shows", "festas", "Uberlândia", "Triângulo Mineiro", "eventos", "rodeio"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MeuIngresso",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-inter bg-gray-50 text-gray-900 antialiased pb-16 md:pb-0 min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Header />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
