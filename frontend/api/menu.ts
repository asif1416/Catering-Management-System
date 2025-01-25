import api from "@/api/api";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export async function fetchMenuItem(id: string): Promise<MenuItem | null> {
  try {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch menu item:", error);
    return null;
  }
}
