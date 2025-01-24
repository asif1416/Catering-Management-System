import { create } from "zustand";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  available: boolean;
  image?: string;
}

export interface CartItem {
  id: number;
  menuId: number; 
  name: string;
  price: number; 
  quantity: number; 
  image?: string; 
}


interface CartStore {
  items: CartItem[];
  selectedItems: Set<number>;
  setItems: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  toggleItemSelection: (itemId: number) => void;
  toggleAllSelection: (selected: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  selectedItems: new Set(),

  setItems: (items) => set({ items }),

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
      selectedItems: new Set(
        Array.from(state.selectedItems).filter((id) => id !== itemId)
      ),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    })),

  toggleItemSelection: (itemId) =>
    set((state) => {
      const newSelected = new Set(state.selectedItems);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return { selectedItems: newSelected };
    }),

  toggleAllSelection: (selected) =>
    set((state) => ({
      selectedItems: selected
        ? new Set(state.items.map((item) => item.id))
        : new Set(),
    })),

  clearCart: () => set({ items: [], selectedItems: new Set() }),
}));
