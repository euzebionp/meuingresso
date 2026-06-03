"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  ticketId: string;
  eventId: string;
  eventName: string;
  ticketName: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (ticketId: string) => void;
  updateQuantity: (ticketId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("meuingresso_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("meuingresso_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: CartItem) => {
    setItems((current) => {
      // Verifica se é de outro evento. Se sim, podemos limpar o carrinho (regra de negócio comum)
      // Mas por enquanto vamos apenas adicionar/atualizar
      const existing = current.find((item) => item.ticketId === newItem.ticketId);
      if (existing) {
        return current.map((item) =>
          item.ticketId === newItem.ticketId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...current, newItem];
    });
  };

  const removeFromCart = (ticketId: string) => {
    setItems((current) => current.filter((item) => item.ticketId !== ticketId));
  };

  const updateQuantity = (ticketId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(ticketId);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.ticketId === ticketId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
